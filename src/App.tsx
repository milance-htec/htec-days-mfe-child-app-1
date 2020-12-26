import React, { useEffect, useState, useRef } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { History } from 'history';

import { ApolloClient } from 'apollo-client';
import { onError } from 'apollo-link-error';
import { from } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from '@apollo/react-hooks';
import { authMiddleware } from 'common/apollo-setup';

import { ReactSDKClient, useFeature } from '@optimizely/react-sdk';

import { ReefCloudTheme } from 'common/material-ui';
import { Clear } from '@material-ui/icons';
import { ThemeProvider, StylesProvider, createGenerateClassName } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
  PrivateRoute,
  showContentIfRequiredModuleIsPresent,
  useReefCloud,
  UserModule,
} from '@reef-tech/reef-cloud-auth';
import { SuspendError } from '@reef-tech/reef-cloud-auth/lib/constants';

/* Components */
import { Icon } from 'components/atoms';
import { Loader } from 'components/molecules';
import { HomePage, OrganizationsPage, OrganizationUsersPage, RolesPage, ConsumersPage } from 'components/pages';

/* Constants */
import {
  CONSUMERS_USER_MODULE_VIEWER,
  ORGANIZATION_USERS_PAGE_USER_MODULE_VIEWER,
  ORGANIZATIONS_PAGE_USER_MODULE_VIEWER,
  ROLES_PAGE_USER_MODULE_VIEWER,
  ROUTES,
} from 'common/constants';

/* Utility */
import { withCustomHtmlFontSizeBreakpoints } from './common/material-ui';

/* Styles */
import 'app.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/styles.scss';

/* Derived constants */
interface Context {
  getUserOrganizationId: () => number;
  loaderCountDecrement: () => void;
  loaderCountIncrement: () => void;
  doesUserHaveRequiredModules: (
    userRequiredModules: UserModule | UserModule[],
    checkAtLeastPermission?: boolean | undefined,
  ) => boolean;
}

export const AppContext = React.createContext<Context>({
  doesUserHaveRequiredModules: () => false,
  getUserOrganizationId: () => 0,
  loaderCountDecrement: () => {},
  loaderCountIncrement: () => {},
});

export const isDevEnv = process.env.REACT_APP_ENVIROMENT === 'dev';

const generateClassName = createGenerateClassName({
  productionPrefix: 'cprod',
  seed: 'identity-access',
  disableGlobal: true,
});

function App({
  optimizely,
  history,
  isolationEnv = false,
}: {
  optimizely: ReactSDKClient;
  history: History<History.PoorMansUnknown>;
  isolationEnv?: boolean;
}) {
  const [init, setInit] = useState(false);

  const client = useRef<any>(null);

  const { loading: reefCloudLoading, login, userModulesMap, userOrganizationId, setSuspendUserData } = useReefCloud();

  const [optimizelyReadyState, setOptimizelyReadyState] = useState(false);

  const [consumersModuleFeature] = useFeature('consumers_module');
  const [suspendAccountFeature] = useFeature('suspend_account');

  let doesUserHaveRequiredModules: (
    userRequiredModules: UserModule | UserModule[],
    checkAtLeastPermission?: boolean | undefined,
  ) => boolean = () => false;

  if (userModulesMap) {
    doesUserHaveRequiredModules = showContentIfRequiredModuleIsPresent(userModulesMap);
  }

  // Loader
  const [loaderCount, setLoaderCount] = useState(0);

  /* Loader */
  const getLoadingFlagState = () => {
    return loaderCount > 0 ? true : false;
  };

  const loaderCountIncrement = () => {
    setLoaderCount((currentValue) => currentValue + 1);
  };

  const loaderCountDecrement = () => {
    setLoaderCount((currentValue) => currentValue - 1);
  };

  const getUserOrganizationId = () => {
    return userOrganizationId ? parseInt(userOrganizationId) : 0;
  };

  /* On app load hook */
  useEffect(() => {
    /* Apollo setup */
    const logoutLink = onError(({ graphQLErrors, networkError, response, operation, forward }) => {
      if (networkError && (networkError as any).response && (networkError as any).response.status === 401) {
        login({ ref_url: window.location.pathname });
      }
      if (suspendAccountFeature) {
        if (graphQLErrors?.[0]) {
          if (graphQLErrors[0].extensions?.code === 'FORBIDDEN') {
            setSuspendUserData({ reason: SuspendError.SUSPENDED });
          }
          if (graphQLErrors[0].extensions?.code === 'UNAUTHENTICATED') {
            login({ ref_url: window.location.pathname });
          }
        }
      }
    });

    client.current = new ApolloClient({
      link: from([logoutLink, authMiddleware]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        query: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
        mutate: {
          fetchPolicy: 'no-cache',
          errorPolicy: 'all',
        },
      },
    });

    optimizely.onReady().then((e) => {
      setOptimizelyReadyState(true);
    });

    setInit(true);
    // eslint-disable-next-line
  }, []);

  return init && !reefCloudLoading && optimizelyReadyState ? (
    <StylesProvider generateClassName={generateClassName}>
      <ThemeProvider theme={ReefCloudTheme}>
        <CssBaseline />
        <ApolloProvider client={client.current}>
          <AppContext.Provider
            value={{
              doesUserHaveRequiredModules,
              getUserOrganizationId,
              loaderCountDecrement,
              loaderCountIncrement,
            }}
          >
            {/* Global loader */}
            <Loader loaderFlag={getLoadingFlagState()} />

            <div className="app identity-access">
              <div className="app__body">
                {/* Routed page content */}
                <div className="router-content">
                  <ToastContainer
                    hideProgressBar
                    autoClose={3500}
                    draggable={false}
                    limit={1}
                    closeButton={
                      <Icon className="toastify-custom-close-icon">
                        <Clear />
                      </Icon>
                    }
                  />
                  <Switch>
                    {/* Signup */}
                    {/* <Route path={ROUTES.SIGNUP} exact component={SignUpPage} /> */}

                    {/* Signup */}
                    {/* <Route path={ROUTES.WELCOME_CONSUMER} exact component={WelcomeConsumerPage} /> */}

                    {/* Home */}
                    <PrivateRoute path={ROUTES.HOME} exact component={HomePage} />

                    {/* Organizations */}
                    <PrivateRoute
                      path={ROUTES.ORGANIZATIONS}
                      exact
                      requiredUserModules={ORGANIZATIONS_PAGE_USER_MODULE_VIEWER}
                      component={OrganizationsPage}
                    />

                    {/* Roles */}
                    <PrivateRoute
                      path={ROUTES.ROLES}
                      exact
                      requiredUserModules={ROLES_PAGE_USER_MODULE_VIEWER}
                      component={RolesPage}
                    />

                    {/* Organization users */}
                    <PrivateRoute
                      path={ROUTES.ORGANIZATION_USERS}
                      exact
                      requiredUserModules={ORGANIZATION_USERS_PAGE_USER_MODULE_VIEWER}
                      component={OrganizationUsersPage}
                    />

                    {/* Consumers */}
                    {consumersModuleFeature ? (
                      <PrivateRoute
                        path={ROUTES.CONSUMERS}
                        exact
                        requiredUserModules={CONSUMERS_USER_MODULE_VIEWER}
                        component={ConsumersPage}
                      />
                    ) : null}

                    {/* IAM Wildcard handling */}
                    <Route path={ROUTES.IDENTITY_ACCESS_WILDCARD}>
                      <Redirect exact to={ROUTES.HOME} />
                    </Route>

                    {/* IAM Wildcard handling */}
                    {isolationEnv ? (
                      <Route path={ROUTES.WILDCARD}>
                        <Redirect exact to={ROUTES.HOME} />
                      </Route>
                    ) : null}
                  </Switch>
                </div>
              </div>
            </div>
          </AppContext.Provider>
        </ApolloProvider>
      </ThemeProvider>
    </StylesProvider>
  ) : null;
}

export default withCustomHtmlFontSizeBreakpoints(App);
