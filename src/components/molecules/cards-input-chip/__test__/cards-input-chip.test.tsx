import React from 'react';
import { cleanup } from '@testing-library/react';
import { CardsInputChip } from '../cards-input-chip.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'input-with-label-class';
const testStyle = { marginRight: '10px' };
const cardsInputChipTestId = 'cards-input-chip';

const getWrapper = () => {
  return mount(<CardsInputChip className={testClass} style={testStyle} />);
};

it('Renders without crashing', () => {
  const cardsInputChip = findByTestId(getWrapper(), cardsInputChipTestId);

  expect(cardsInputChip.hasClass(testClass)).toBeTruthy();
  expect(cardsInputChip.prop('style')).toEqual(testStyle);
});
