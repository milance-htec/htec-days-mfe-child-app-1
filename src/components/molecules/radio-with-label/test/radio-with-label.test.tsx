import React from 'react';
import { cleanup } from '@testing-library/react';
import { RadioWithLabel } from '../radio-with-label.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'radio-with-label-class';
const testStyle = { marginRight: '10px' };
const defaultCheckedState = false;
const radioWithLabelTestId = 'radio-with-label';

const getWrapper = () => {
  return mount(<RadioWithLabel checked={defaultCheckedState} className={testClass} style={testStyle} />);
};

it('Renders without crashing', () => {
  const radioWithLabel = findByTestId(getWrapper(), radioWithLabelTestId);

  expect(radioWithLabel.hasClass(testClass)).toBeTruthy();
  expect(radioWithLabel.prop('style')).toEqual(testStyle);
});
