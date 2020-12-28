// Polifills for supporting IE9
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';

import { MnMProvider } from '@mnm-tech/provider';

import App from './App';

ReactDOM.render(
  <MnMProvider>
    <App />
  </MnMProvider>,
  document.getElementById('root'),
);
