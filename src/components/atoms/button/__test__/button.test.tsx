import React from 'react';
import ReactDOM from 'react-dom';
import { cleanup } from '@testing-library/react';
import { ReefCloudTheme } from 'common/material-ui';

/* Components */
import { Button } from '../button.component';

/* Utility */
import { WithMaterialTheme } from 'common/test-utility';

afterEach(cleanup);

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(WithMaterialTheme(<Button />, ReefCloudTheme), div);
});
