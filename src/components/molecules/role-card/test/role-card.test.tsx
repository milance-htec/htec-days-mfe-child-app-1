import React from 'react';
import { cleanup } from '@testing-library/react';
import { RoleCard } from '../role-card.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

import { RoleListItem } from 'components/pages/roles/roles.types';
import { AppContext } from 'App';
import { UserModule } from '@reef-tech/reef-cloud-auth';

afterEach(cleanup);

const testClass = 'role-card-class';
const testStyle = { marginRight: '10px' };
const roleTest: RoleListItem = {
  id: '1',
  name: 'Test',
  description: 'Test desc',
  numberOfAssignedModules: 1,
  numberOfAssignedUsers: 1,
};
const editActionTest = jest.fn((value: any) => {});
const deleteActionTest = jest.fn((value: any) => {});
const getUserOrganizationIdTest = () => 1;
const loaderCountDecrementTest = () => {};
const loaderCountIncrementTest = () => {};
const doesUserHaveRequiredModulesTest = (
  userRequiredModules: UserModule | UserModule[],
  checkAtLeastPermission?: boolean | undefined,
) => true;
const roleCardTestId = 'role-card';
const roleCardTestDropdownIconId = 'role-card-dropdown-icon';

const getWrapper = () => {
  return mount(
    <AppContext.Provider
      value={{
        loaderCountDecrement: loaderCountDecrementTest,
        loaderCountIncrement: loaderCountIncrementTest,
        doesUserHaveRequiredModules: doesUserHaveRequiredModulesTest,
        getUserOrganizationId: getUserOrganizationIdTest,
      }}
    >
      <RoleCard
        role={roleTest}
        editAction={editActionTest}
        deleteAction={deleteActionTest}
        className={testClass}
        style={testStyle}
      />
    </AppContext.Provider>,
  );
};

it('Renders without crashing', () => {
  const roleCard = findByTestId(getWrapper(), roleCardTestId);

  expect(roleCard.hasClass(testClass)).toBeTruthy();
  expect(roleCard.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with dropdown click', () => {
  const wrapper = getWrapper();
  const roleCardDropdownIcon = findByTestId(wrapper, roleCardTestDropdownIconId);
  roleCardDropdownIcon.simulate('click');
});
