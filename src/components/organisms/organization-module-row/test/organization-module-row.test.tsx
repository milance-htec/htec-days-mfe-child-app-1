import React from 'react';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import { OrganizationModuleRow } from '../organization-module-row.component';

import { findByTestId, WithMaterialTheme } from 'common/test-utility';
import { ReefCloudTheme } from 'common/material-ui';

import { OrganizationModule } from 'components/pages/organizations/organizations.types';

afterEach(cleanup);

const testClass = 'organization-module-row-class';
const testStyle = { marginRight: '10px' };
const testModule: OrganizationModule = {
  id: '1',
  name: 'Test module',
  subModules: [],
};
const testModuleWithSubmodules = {
  id: '1',
  name: 'Test module',
  subModules: [
    {
      id: '2',
      name: 'Test module 2',
      subModules: [],
    },
    {
      id: '3',
      name: 'Test module 3',
      subModules: [],
    },
  ],
};
const organizationModuleRowTestId = 'organization-module-row';
const organizationModuleRowItemBoxTestId = 'item-box';

const getWrapper = (
  module: OrganizationModule,
  onSelect: (module: OrganizationModule, isSelected: boolean) => void,
) => {
  return mount(
    WithMaterialTheme(
      <OrganizationModuleRow onSelect={onSelect} module={module} className={testClass} style={testStyle} />,
      ReefCloudTheme,
    ),
  );
};

it('Renders without crashing', () => {
  const onSelect = jest.fn((module: OrganizationModule, isSelected: boolean) => {});
  const organizationModuleRow = findByTestId(getWrapper(testModule, onSelect), organizationModuleRowTestId);

  expect(organizationModuleRow.hasClass(testClass)).toBeTruthy();
  expect(organizationModuleRow.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with row click', () => {
  const onSelect = jest.fn((module: OrganizationModule, isSelected: boolean) => {});
  const organizationModuleRowItemBox = findByTestId(
    getWrapper(testModuleWithSubmodules, onSelect),
    organizationModuleRowItemBoxTestId,
  );

  organizationModuleRowItemBox.simulate('click');
});
