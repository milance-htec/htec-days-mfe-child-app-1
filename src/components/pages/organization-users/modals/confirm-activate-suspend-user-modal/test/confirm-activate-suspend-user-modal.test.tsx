import React from 'react';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import { ConfirmActivateSuspendUserModal } from '../confirm-activate-suspend-user.modal';

import { findByTestId, WithMaterialTheme } from 'common/test-utility';
import { ReefCloudTheme } from 'common/material-ui';

import { ActivateSuspendSelectedUserData } from '../confirm-activate-suspend-user.types';
import { USER_STATUSES } from 'common/constants';

afterEach(cleanup);

const setModalStateTest = jest.fn((state: boolean, modalOptions?: any) => () => {});
const onActivateSuspendActionClickTest = jest.fn(() => {});
const getModalData = (isSuspended: boolean) => {
  const selectedUserTest = {
    email: 'test@gmail.com',
    familyName: 'Testovic',
    fullName: 'Test Testovic',
    givenName: 'Test',
    id: '1',
    roles: [],
    username: 'testic',
    userStatus: isSuspended ? USER_STATUSES.SUSPENDED : USER_STATUSES.ACTIVE,
    profilePictureUrl: '',
  };
  return { selectedUser: selectedUserTest, isSuspended: isSuspended };
};
const modalWrapperTestId = 'modal';
const modalActionButtonTestId = 'confirm-activate-suspend-user-modal-action-button';

const getWrapper = (
  setModalState: (state: boolean, modalOptions?: any) => () => void,
  modalState: boolean = false,
  modalData: ActivateSuspendSelectedUserData | null = null,
  onActivateSuspendActionClick: () => void = () => {},
) => {
  const componenetWrapper = mount(
    WithMaterialTheme(
      <ConfirmActivateSuspendUserModal
        modalState={modalState}
        setModalState={setModalState}
        modalData={modalData}
        onActivateSuspendActionClick={onActivateSuspendActionClick}
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

it('Renders without crashing when opened with modal data as suspended user', async () => {
  const modal = findByTestId(getWrapper(setModalStateTest, true, getModalData(true)), modalWrapperTestId);
  expect(modal.length).not.toBe(0);
});

it('Renders without crashing when opened with modal data as active user', async () => {
  const modal = findByTestId(getWrapper(setModalStateTest, true, getModalData(false)), modalWrapperTestId);
  expect(modal.length).not.toBe(0);
});

it('Renders without crashing when opened with modal data and action', async () => {
  const modalActionButton = findByTestId(
    getWrapper(setModalStateTest, true, getModalData(false), onActivateSuspendActionClickTest),
    modalActionButtonTestId,
  );
  modalActionButton.simulate('click');
  expect(onActivateSuspendActionClickTest).toBeCalled();
});

// TODO: check test when api is available
