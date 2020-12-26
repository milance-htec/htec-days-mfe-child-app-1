import React from 'react';
import { cleanup } from '@testing-library/react';
import { Chip } from '../chip.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'chip-class';
const testStyle = { marginRight: '10px' };
const chipTestId = 'chip';

const getWrapper = () => {
  return mount(<Chip className={testClass} style={testStyle} />);
};

it('Renders without crashing', () => {
  const chip = findByTestId(getWrapper(), chipTestId);

  expect(chip.hasClass(testClass)).toBeTruthy();
  expect(chip.prop('style')).toEqual(testStyle);
});
