// Polifills for supporting IE9
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import { ReefCloudProvider, ReefCloudAuthServiceOptions } from '@reef-tech/reef-cloud-auth';
import { Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';

import { createInstance, OptimizelyProvider, setLogger } from '@optimizely/react-sdk';

import App from './App';

// import './bootstrap.scss';

import { AUTH_API_URL, RC_LOGIN_URL, RC_REDIRECT_URL } from 'common/constants';

const RCAuthServiceOptions: ReefCloudAuthServiceOptions = {
  loginUrl: RC_LOGIN_URL || '',
  callbackUrl: RC_REDIRECT_URL,
  authApiUrl: AUTH_API_URL || '',
};

export const browserHistory = createBrowserHistory();

const optimizely = createInstance({
  sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY,
  eventFlushInterval: 1000,
  eventBatchSize: 10,
});

// if (process.env.REACT_APP_ENVIROMENT !== 'dev' && process.env.REACT_APP_ENVIROMENT !== 'local') {
setLogger(null); //disable optimizely browser console logging;
// }

ReactDOM.render(
  <Router history={browserHistory}>
    <ReefCloudProvider options={{ authServiceOptions: RCAuthServiceOptions }}>
      <OptimizelyProvider optimizely={optimizely} userId="reefuser">
        <App optimizely={optimizely} history={browserHistory} isolationEnv />
      </OptimizelyProvider>
    </ReefCloudProvider>
  </Router>,
  document.getElementById('root'),
);
