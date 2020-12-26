import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { createInstance } from '@optimizely/react-sdk';

import App from './App';
import { withOptimizelyProvider } from 'common/test-utility';

const optimizelyTest = createInstance({
  sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY,
});

const browserHistoryTest = createBrowserHistory();

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    withOptimizelyProvider(<App optimizely={optimizelyTest} history={browserHistoryTest} isolationEnv />),
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
