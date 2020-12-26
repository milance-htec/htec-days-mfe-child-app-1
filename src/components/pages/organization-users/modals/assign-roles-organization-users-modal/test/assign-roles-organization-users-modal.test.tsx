import React from 'react';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import { AssignRolesOrganizationUsersModal } from '../assign-roles-organization-users.modal';

import { findByTestId, WithApolloClient, setupIntersectionObserverMock, WithMaterialTheme } from 'common/test-utility';
import { GQL_UPDATE_USER_ROLES_MUTATION } from '../assign-roles-organization-users.constants';
import { ReefCloudTheme } from 'common/material-ui';
import { GQL_GET_ROLES_LIST_QUERY } from 'components/pages/roles/roles.constants';

import { OrganizationUser } from 'components/pages/organization-users/organization-users.types';

afterEach(cleanup);

const setModalStateTest = jest.fn((state: boolean, modalOptions?: any) => () => {});
const onAssignUserRolesDoneTest = jest.fn((isDone: boolean) => {});
const organizationUserTest: OrganizationUser = {
  email: 'test@email.com',
  familyName: 'Testic',
  fullName: 'Test Testic',
  givenName: 'Test',
  id: 1,
  roles: [
    {
      id: '1',
      name: 'Test name',
      description: 'Test desc',
      numberOfAssignedModules: 1,
      numberOfAssignedUsers: 1,
    },
  ],
  username: 'testic',
  profilePictureUrl: '',
  userStatus: 'ACTIVE',
};
const mocksTest = [
  {
    request: {
      query: GQL_GET_ROLES_LIST_QUERY,
      variables: {
        organizationId: '0',
        pageNumber: 0,
        pageSize: 30,
      },
    },
    result: {
      data: {
        organizationRolesPage: {
          content: [
            {
              id: '1',
              name: 'Test name',
              description: 'Test desc',
              numberOfAssignedModules: 1,
              numberOfAssignedUsers: 1,
            },
            {
              id: '2',
              name: 'Test name 2',
              description: 'Test desc 2',
              numberOfAssignedModules: 1,
              numberOfAssignedUsers: 1,
            },
          ],
          totalItems: 1,
          totalPages: 1,
        },
      },
    },
  },
  {
    request: {
      query: GQL_UPDATE_USER_ROLES_MUTATION,
      variables: {
        userId: 1,
        rolesList: [1, 2, 3],
        organizationId: 1,
      },
    },
    result: {
      data: {
        assignRoles: true,
      },
    },
  },
];
const modalWrapperTestId = 'modal';
const modalRowTestId = 'organization-user-role-row';
const modalItemBoxTestId = 'item-box';
const modalAssignButtonTestId = 'assign-roles-button';

const getWrapper = (
  setModalState: (state: boolean, modalOptions?: any) => () => void,
  onAssignUserRolesDone: (isDone: boolean) => void,
  modalState: boolean = false,
  organizationUser: OrganizationUser | null = null,
) => {
  const componenetWrapper = mount(
    WithMaterialTheme(
      WithApolloClient(
        <AssignRolesOrganizationUsersModal
          modalState={modalState}
          setModalState={setModalState}
          organizationUser={organizationUser}
          onAssignUserRolesDone={onAssignUserRolesDone}
        />,
        mocksTest,
      ),
      ReefCloudTheme,
    ),
  );
  return componenetWrapper;
};

it('Renders without crashing when closed', () => {
  setupIntersectionObserverMock();
  const modal = findByTestId(getWrapper(setModalStateTest, onAssignUserRolesDoneTest), modalWrapperTestId);
  expect(modal.length).toBe(0);
});

it('Renders without crashing when opened', () => {
  setupIntersectionObserverMock();
  const modal = findByTestId(getWrapper(setModalStateTest, onAssignUserRolesDoneTest, true), modalWrapperTestId);
  expect(modal.length).not.toBe(0);
});

it('Renders without crashing when opened and with organization user', () => {
  setupIntersectionObserverMock();
  const modal = findByTestId(
    getWrapper(setModalStateTest, onAssignUserRolesDoneTest, true, organizationUserTest),
    modalWrapperTestId,
  );
  expect(modal.length).not.toBe(0);
});

it('Renders without crashing when opened and role selected and unselected', async () => {
  setupIntersectionObserverMock();
  const wrapper = getWrapper(setModalStateTest, onAssignUserRolesDoneTest, true, organizationUserTest);
  await new Promise((resolve) => setTimeout(resolve, 250));
  wrapper.update();
  const modal = findByTestId(wrapper, modalWrapperTestId);
  const modalRows = findByTestId(wrapper, modalRowTestId);
  const modalItemBoxes = findByTestId(modalRows.last(), modalItemBoxTestId);
  const lastItemBox = modalItemBoxes.last();
  lastItemBox.simulate('click');
  lastItemBox.simulate('click');
  expect(modal.length).not.toBe(0);
});

it('Renders without crashing when opened and assign selected roles', async () => {
  setupIntersectionObserverMock();
  const wrapper = getWrapper(setModalStateTest, onAssignUserRolesDoneTest, true, organizationUserTest);
  await new Promise((resolve) => setTimeout(resolve, 250));
  wrapper.update();
  const modalRows = findByTestId(wrapper, modalRowTestId);
  const assignButton = findByTestId(wrapper, modalAssignButtonTestId);
  const modalItemBoxes = findByTestId(modalRows.last(), modalItemBoxTestId);
  const lastItemBox = modalItemBoxes.last();
  lastItemBox.simulate('click');
  assignButton.simulate('click');
});
