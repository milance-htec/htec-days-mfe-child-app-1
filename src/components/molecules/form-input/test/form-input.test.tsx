import React from 'react';
import { cleanup } from '@testing-library/react';
import { FormInput } from '../form-input.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'form-input-class';
const testStyle = { marginRight: '10px' };
const formInputTestId = 'form-input';
const formInputTextTestId = 'form-input-text';
const formInputSearchTestId = 'form-input-search';
const formInputPasswordTestId = 'form-input-password';
const formInputInputTestId = 'input';
const formInputPasswordIcon = 'form-input-visibility-icon';

const getWrapper = (
  name: string = 'Test',
  type: 'text' | 'password' | 'search' | undefined = 'text',
  hasDebounce: boolean = false,
  onTouched?: () => void,
  onBlur?: () => void,
  onFocus?: () => void,
  onKeyDown?: () => void,
  value?: string,
  showPasswordIcon: boolean = true,
) => {
  return mount(
    <FormInput
      name={name}
      type={type}
      hasDebounce={hasDebounce}
      onTouched={onTouched}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      showPasswordIcon={showPasswordIcon}
      value={value}
      className={testClass}
      style={testStyle}
    />,
  );
};

it('Renders without crashing', () => {
  const formInput = findByTestId(getWrapper(), formInputTestId);

  expect(formInput.hasClass(testClass)).toBeTruthy();
  expect(formInput.prop('style')).toEqual(testStyle);
});

it('Renders with input password events', () => {
  const onTouch = jest.fn(() => {});
  const onBlur = jest.fn(() => {});
  const onFocus = jest.fn(() => {});
  const onKeyDown = jest.fn(() => {});
  const wrapper = getWrapper('Test', 'password', true, onTouch, onBlur, onFocus, onKeyDown, 'Test');
  const formInput = findByTestId(wrapper, formInputPasswordTestId);
  const formPasswordInputIcon = findByTestId(wrapper, formInputPasswordIcon);
  formInput.simulate('focus');
  formInput.simulate('keydown');
  formInput.simulate('blur');
  formPasswordInputIcon.simulate('click');
  expect(onFocus).toBeCalled();
  expect(onBlur).toBeCalled();
  expect(onKeyDown).toBeCalled();
});

it('Renders with input search', () => {
  const onTouch = jest.fn(() => {});
  const onBlur = jest.fn(() => {});
  const onFocus = jest.fn(() => {});
  const onKeyDown = jest.fn(() => {});
  const wrapper = getWrapper('Test', 'search', true, onTouch, onBlur, onFocus, onKeyDown);
  const formSearchInput = findByTestId(wrapper, formInputSearchTestId);
  formSearchInput.simulate('focus');
  formSearchInput.simulate('blur');
  expect(onFocus).toBeCalled();
  expect(onBlur).toBeCalled();
});

it('Renders with input text', () => {
  const onTouch = jest.fn(() => {});
  const onBlur = jest.fn(() => {});
  const onFocus = jest.fn(() => {});
  const onKeyDown = jest.fn(() => {});
  const wrapper = getWrapper('Test', 'text', true, onTouch, onBlur, onFocus, onKeyDown);
  const formInput = findByTestId(wrapper, formInputTextTestId);
  const formTextInput = findByTestId(formInput, formInputInputTestId);
  formTextInput.simulate('change', { target: { value: 'Test value' } });
  formInput.simulate('focus');
  formInput.simulate('blur');
  expect(onFocus).toBeCalled();
  expect(onBlur).toBeCalled();
});

// TODO: check onTouched callback
