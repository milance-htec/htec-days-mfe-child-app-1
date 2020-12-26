import React from 'react';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import { HomeModuleTile } from '../home-module-tile.component';

import { findByTestId, WithMaterialTheme } from 'common/test-utility';
import { ReefCloudTheme } from 'common/material-ui';

import HomeTileUsers from 'assets/images/home-users-tile.svg';

afterEach(cleanup);

const testClass = 'home-module-tile-class';
const testStyle = { marginRight: '10px' };
const homeModuleTileImage = HomeTileUsers;
const homeModuleTileRoute = '/identity-access/organizations/users';
const homeModuleTileTestId = 'home-module-tile';

const getWrapper = () => {
  return mount(
    WithMaterialTheme(
      <HomeModuleTile
        image={homeModuleTileImage}
        route={homeModuleTileRoute}
        className={testClass}
        style={testStyle}
      />,
      ReefCloudTheme,
    ),
  );
};

it('Renders without crashing', () => {
  const homeModuleTile = findByTestId(getWrapper(), homeModuleTileTestId);

  expect(homeModuleTile.hasClass(testClass)).toBeTruthy();
  expect(homeModuleTile.prop('style')).toEqual(testStyle);
});
