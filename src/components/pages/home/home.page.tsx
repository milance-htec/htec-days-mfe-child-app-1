import React, { FunctionComponent, useEffect } from 'react';
import { AuthorizationContent, setCurrentPageTitle } from '@reef-tech/reef-cloud-auth';
import { useFeature } from '@optimizely/react-sdk';

/* Components */
import { PageContainer } from 'components/atoms';
import { PageHeader, PageContent, HomeModuleTile, Flex } from 'components/molecules';

/* Types */
import { HomeProps } from './home.types';

/* Constants */
import {
  CONSUMERS_USER_MODULE_VIEWER,
  ORGANIZATION_USERS_PAGE_USER_MODULE_VIEWER,
  ORGANIZATIONS_PAGE_USER_MODULE_VIEWER,
  PAGE_NAMES,
  ROLES_PAGE_USER_MODULE_VIEWER,
  ROUTES,
} from 'common/constants';

/* Styles */
import './home.page.scss';

/* Assets */
import HomeTileUsers from 'assets/images/home-users-tile.svg';
import HomeTileRoles from 'assets/images/home-roles-tile.svg';
import HomeTileOrganizations from 'assets/images/home-organizations-tile.svg';

export const HomePage: FunctionComponent<HomeProps> = () => {
  const [consumersModuleFeature] = useFeature('consumers_module');

  useEffect(() => {
    setCurrentPageTitle(PAGE_NAMES.HOME);
  }, []);

  return (
    <PageContainer flex>
      <PageHeader breadcrumbs={false} title="Identity Access"></PageHeader>
      <PageContent className="home-page__page-content" scrollable>
        <Flex.Layout flexWrap="wrap">
          {/* Users */}
          <AuthorizationContent requiredModules={ORGANIZATION_USERS_PAGE_USER_MODULE_VIEWER} checkAtLeastPermission>
            <HomeModuleTile
              buttonId="home-page-home-tiles-organization-users-page"
              className="home-page-tile"
              image={HomeTileUsers}
              qaName="users-module-view"
              route={ROUTES.ORGANIZATION_USERS}
            >
              Users
            </HomeModuleTile>
          </AuthorizationContent>

          {/* Roles */}
          <AuthorizationContent requiredModules={ROLES_PAGE_USER_MODULE_VIEWER} checkAtLeastPermission>
            <HomeModuleTile
              buttonId="home-page-home-tiles-roles-page"
              className="home-page-tile"
              image={HomeTileRoles}
              qaName="roles-module-view"
              route={ROUTES.ROLES}
            >
              Roles
            </HomeModuleTile>
          </AuthorizationContent>

          {/* Organizations */}
          <AuthorizationContent requiredModules={ORGANIZATIONS_PAGE_USER_MODULE_VIEWER} checkAtLeastPermission>
            <HomeModuleTile
              buttonId="home-page-home-tiles-organizations-page"
              className="home-page-tile"
              image={HomeTileOrganizations}
              qaName="organizations-module-view"
              route={ROUTES.ORGANIZATIONS}
            >
              Organizations
            </HomeModuleTile>
          </AuthorizationContent>

          {/* Consumers */}
          {consumersModuleFeature ? (
            <AuthorizationContent requiredModules={CONSUMERS_USER_MODULE_VIEWER} checkAtLeastPermission>
              <HomeModuleTile
                buttonId="home-page-home-tiles-consumers-page"
                className="home-page-tile"
                image={HomeTileUsers}
                qaName="consumers-module-view"
                route={ROUTES.CONSUMERS}
              >
                Consumers
              </HomeModuleTile>
            </AuthorizationContent>
          ) : null}
        </Flex.Layout>
      </PageContent>
    </PageContainer>
  );
};
