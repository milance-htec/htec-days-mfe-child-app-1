import React from 'react';
import { cleanup } from '@testing-library/react';
import { OrganizationUserRoleRow } from '../organization-user-role-row.component';
import { mount } from 'enzyme';
import { findByTestId, WithMaterialTheme } from 'common/test-utility';

import { RoleListItem } from 'components/pages/roles/roles.types';
import { ReefCloudTheme } from 'common/material-ui';

afterEach(cleanup);

const testClass = 'organization-user-role-row-class';
const testStyle = { marginRight: '10px' };
const testRole: RoleListItem = {
  id: '1',
  name: 'Test module',
  description: 'Test desc',
  numberOfAssignedModules: 1,
  numberOfAssignedUsers: 1,
};
const organizationUserRoleRowTestId = 'organization-user-role-row';
const organizationUserRoleRowItemBoxTestId = 'item-box';

const getWrapper = (onSelect: (testRole: RoleListItem, isSelected: boolean) => void) => {
  return mount(
    WithMaterialTheme(
      <OrganizationUserRoleRow onSelect={onSelect} role={testRole} className={testClass} style={testStyle} />,
      ReefCloudTheme,
    ),
  );
};

it('Renders without crashing', () => {
  const onSelect = jest.fn((module: RoleListItem, isSelected: boolean) => {});
  const organizationUserRoleRow = findByTestId(getWrapper(onSelect), organizationUserRoleRowTestId);

  expect(organizationUserRoleRow.hasClass(testClass)).toBeTruthy();
  expect(organizationUserRoleRow.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with row click', () => {
  const onSelect = jest.fn((module: RoleListItem, isSelected: boolean) => {});
  const organizationUserRoleRowItemBox = findByTestId(getWrapper(onSelect), organizationUserRoleRowItemBoxTestId);

  organizationUserRoleRowItemBox.simulate('click');
});
