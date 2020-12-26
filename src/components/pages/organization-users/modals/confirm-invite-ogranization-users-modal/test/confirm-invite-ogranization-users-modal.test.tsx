import React from 'react';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import { ConfirmInviteOrganizationUsersModal } from '../confirm-invite-ogranization-users.modal';

import { findByTestId, WithMaterialTheme } from 'common/test-utility';
import { ReefCloudTheme } from 'common/material-ui';

import {
  InviteOrganizationUsersSummary,
  InviteUserRole,
} from '../../invite-organization-users-modal/invite-organization-users.types';

afterEach(cleanup);

const setModalStateTest = jest.fn((state: boolean, modalOptions?: any) => () => {});
const inviteOrganizationUsersSummaryTest: InviteOrganizationUsersSummary = {
  numberOfAssignedToRole: 1,
  numberOfInvitedAndAssignedToRole: 1,
};
const selectedRoleTest: InviteUserRole = {
  id: '1',
  name: 'Test role',
};
const modalWrapperTestId = 'modal';

const getWrapper = (
  setModalState: (state: boolean, modalOptions?: any) => () => void,
  modalState: boolean = false,
  selectedRole: InviteUserRole | null = null,
  inviteOrganizationUsersSummary: InviteOrganizationUsersSummary | null = null,
) => {
  const componenetWrapper = mount(
    WithMaterialTheme(
      <ConfirmInviteOrganizationUsersModal
        modalState={modalState}
        setModalState={setModalState}
        inviteOrganizationUsersSummary={inviteOrganizationUsersSummary}
        selectedRole={selectedRole}
      />,
      ReefCloudTheme,
    ),
  );
  return componenetWrapper;
};

it('Renders without crashing when closed', async () => {
  const modal = findByTestId(getWrapper(setModalStateTest), modalWrapperTestId);
  expect(modal.length).toBe(0);
});

it('Renders without crashing when opened', async () => {
  const modal = findByTestId(getWrapper(setModalStateTest, true), modalWrapperTestId);
  expect(modal.length).not.toBe(0);
});

it('Renders without crashing when opened with selected role and user summary', async () => {
  const modal = findByTestId(
    getWrapper(setModalStateTest, true, selectedRoleTest, inviteOrganizationUsersSummaryTest),
    modalWrapperTestId,
  );
  expect(modal.length).not.toBe(0);
});

it('Renders without crashing when opened with selected role and user summary only with roles', async () => {
  const inviteOrganizationUsersSummaryRolesOnlyTest = inviteOrganizationUsersSummaryTest;
  inviteOrganizationUsersSummaryRolesOnlyTest.numberOfInvitedAndAssignedToRole = 0;
  const modal = findByTestId(
    getWrapper(setModalStateTest, true, selectedRoleTest, inviteOrganizationUsersSummaryRolesOnlyTest),
    modalWrapperTestId,
  );
  expect(modal.length).not.toBe(0);
});
