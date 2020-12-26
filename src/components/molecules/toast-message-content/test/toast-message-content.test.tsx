import React from 'react';
import { cleanup } from '@testing-library/react';
import { ToastMessasgeContent, setToastMessage } from '../toast-message-content.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'toast-message-class';
const successClass = 'toast-message-content__icon toast-message-content__icon--success';
const errorClass = 'toast-message-content__icon toast-message-content__icon--error';
const testStyle = { marginRight: '10px' };
const errorTypeTest = 'error';
const toastMessageTest = 'Test message';
const toastMessageTestId = 'toast-message';
const toastMessageIconTestId = 'icon';

const getWrapper = (type: 'success' | 'error' = 'success') => {
  return mount(<ToastMessasgeContent type={type} className={testClass} style={testStyle} />);
};

it('Renders without crashing', () => {
  const wrapper = getWrapper();
  const toastMessage = findByTestId(wrapper, toastMessageTestId);
  const toastMessageIcon = findByTestId(wrapper, toastMessageIconTestId);

  expect(toastMessage.hasClass(testClass)).toBeTruthy();
  expect(toastMessageIcon.hasClass(successClass)).toBeTruthy();
  expect(toastMessage.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with error type message', () => {
  const wrapper = getWrapper(errorTypeTest);
  const toastMessageIcon = findByTestId(wrapper, toastMessageIconTestId);

  expect(toastMessageIcon.hasClass(errorClass)).toBeTruthy();
});

it('Renders without crashing with emitting taost message', () => {
  const toastContent = setToastMessage(toastMessageTest);
  expect(toastContent).not.toBeNull();
});
