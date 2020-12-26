import React from 'react';
import { cleanup } from '@testing-library/react';
import { InputWithLabel } from '../input-with-label.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'input-with-label-class';
const testStyle = { marginRight: '10px' };
const inputWithLabelTestId = 'input-with-label';

const getWrapper = (message?: any) => {
  return mount(<InputWithLabel message={message} className={testClass} style={testStyle} />);
};

it('Renders without crashing', () => {
  const inputWithLabel = findByTestId(getWrapper(), inputWithLabelTestId);

  expect(inputWithLabel.hasClass(testClass)).toBeTruthy();
  expect(inputWithLabel.prop('style')).toEqual(testStyle);
});

it('Renders input with label with message prop', () => {
  const message = { message: 'Test' };
  const wrapper = getWrapper(message);

  expect(wrapper.prop('message')).toEqual(message);
});
