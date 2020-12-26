import React from 'react';
import { act, cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import { ConsumerProfileModal, CONSUMER_PROFILE_TEST_ID } from 'components/organisms';

import { findByTestId, WithApolloClient, WithMaterialTheme } from 'common/test-utility';
import { ReefCloudTheme } from 'common/material-ui';
import { GQL_GET_CONSUMER_DATA_QUERY } from '../consumer-profile-modal.constants';

afterEach(cleanup);

const setModalStateTest = jest.fn((state: boolean, modalOptions?: any) => jest.fn(() => {}));
const setModalStateFunctionTest = (state: boolean, modalOptions?: any) => () => {};
const onConsumerUpdate = jest.fn(() => {});
const consumerIdTest = '1';
const mocksTest = [
  {
    request: {
      query: GQL_GET_CONSUMER_DATA_QUERY,
      variables: {
        consumerId: 1,
      },
    },
    result: {
      data: {
        consumerUserDataById: {
          id: 1,
          consumerId: 1,
          username: 'Testic',
          isSsoUser: false,
          givenName: 'Test',
          familyName: 'Testovic',
          fullName: 'Test Testovic',
          email: 'test@gmail.com',
          temporaryEmail: null,
          phoneNumber: '+1234567',
          temporaryPhoneNumber: null,
          userStatus: 'ACTIVE',
          lastModifiedDate: '2020-12-11T11:08:55.007215',
        },
      },
    },
  },
];

const getWrapper = (
  setModalState: (state: boolean, modalOptions?: any) => () => void,
  onConsumerUpdate: () => void,
  modalState: boolean = false,
  consumerId: string | null = null,
) => {
  const componenetWrapper = mount(
    WithMaterialTheme(
      WithApolloClient(
        <ConsumerProfileModal
          setModalState={setModalState}
          onConsumerUpdate={onConsumerUpdate}
          modalState={modalState}
          consumerId={consumerId}
        />,
        mocksTest,
      ),
      ReefCloudTheme,
    ),
  );
  return componenetWrapper;
};

it('Renders without crashing when closed', () => {
  const modal = findByTestId(getWrapper(setModalStateTest, onConsumerUpdate), CONSUMER_PROFILE_TEST_ID);
  expect(modal.length).toBe(0);
});

it('Renders without crashing when opened', () => {
  const modal = findByTestId(getWrapper(setModalStateTest, onConsumerUpdate, true), CONSUMER_PROFILE_TEST_ID);
  modal.update();
  expect(modal.length).toBe(0);
});

it('Renders without crashing when opened and with consumer id', async () => {
  await act(async () => {
    const wrapper = getWrapper(setModalStateTest, onConsumerUpdate, true, consumerIdTest);
    await new Promise((resolve) => setTimeout(resolve, 250));
    wrapper.update();
    const modal = findByTestId(wrapper, CONSUMER_PROFILE_TEST_ID);
    expect(modal.length).not.toBe(0);
  });
});

it('Renders without crashing when opened with consumer id and close modal', async () => {
  await act(async () => {
    const wrapper = getWrapper(setModalStateFunctionTest, onConsumerUpdate, true, consumerIdTest);
    await new Promise((resolve) => setTimeout(resolve, 250));
    wrapper.update();
    const modal = findByTestId(wrapper, CONSUMER_PROFILE_TEST_ID);
    modal.simulate('click');
    expect(modal.length).toBe(1);
  });
});
