import React from 'react';
import { cleanup } from '@testing-library/react';
import { LabeledRadio } from '../labeled-radio.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'labeled-radio';
const testStyle = { marginRight: '10px' };
const testText = 'Test text';
const labeledRadioTestId = 'labeled-radio';
const labeledRadioButtonTestId = 'radio';

const getWrapper = (onRadioButtonClick?: (value: any) => void) => {
  return mount(
    <LabeledRadio className={testClass} style={testStyle} text={testText} onRadioButtonClick={onRadioButtonClick} />,
  );
};

it('Renders without crashing', () => {
  const labeledRadio = findByTestId(getWrapper(), labeledRadioTestId);

  expect(labeledRadio.hasClass(testClass)).toBeTruthy();
  expect(labeledRadio.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with radio button click', () => {
  const onRadioButtonClick = jest.fn((value: any) => {});
  const wrapper = getWrapper(onRadioButtonClick);
  const labeledRadioButton = findByTestId(wrapper, labeledRadioButtonTestId);
  labeledRadioButton.simulate('change');
  expect(onRadioButtonClick).toBeCalled();
});
