import React from 'react';
import { cleanup } from '@testing-library/react';
import { InputSelect } from '../input-select.component';
import { mount } from 'enzyme';
import { findByTestId, setupIntersectionObserverMock } from 'common/test-utility';
import { InputSelectOption } from '../input-select.types';

afterEach(cleanup);

const testClass = 'input-select-class';
const testStyle = { marginRight: '10px' };
const testOptions: InputSelectOption[] = [
  { title: 'Test1', value: 'TestValue1' },
  { title: 'Test2', value: 'TestValue2' },
];
const testOption: InputSelectOption[] = [{ title: 'Test1', value: 'TestValue1' }];
const inputSelectTestId = 'input-select';
const inputSelectDropdownTestId = 'input-select-dropdown';
const inputTestId = 'input';
const inputSelectClearIconTestId = 'input-select-input-clear-icon';
const inputSelectOptionTestId = 'input-select-option-list-option';

const getWrapper = (
  options: InputSelectOption[],
  onOptionSelect: (option: InputSelectOption | null) => void,
  type?: 'input' | 'select',
  unselectElement?: boolean,
  clearValueIcon?: boolean,
  onInputChange?: () => void,
) => {
  return mount(
    <InputSelect
      options={options}
      onOptionSelect={onOptionSelect}
      type={type}
      unselectElement={unselectElement}
      onInputChange={onInputChange}
      clearValueIcon={clearValueIcon}
      className={testClass}
      style={testStyle}
    />,
  );
};

it('Renders without crashing', () => {
  setupIntersectionObserverMock();
  const onOptionSelect = jest.fn((option: InputSelectOption | null) => {});
  const inputSelect = findByTestId(getWrapper(testOptions, onOptionSelect), inputSelectTestId);

  expect(inputSelect.hasClass(testClass)).toBeTruthy();
  expect(inputSelect.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with dropdown click', () => {
  setupIntersectionObserverMock();
  const onOptionSelect = jest.fn((option: InputSelectOption | null) => {});
  const inputSelectDropDown = findByTestId(getWrapper(testOptions, onOptionSelect), inputSelectDropdownTestId);

  inputSelectDropDown.simulate('click');
});

it('Renders without crashing with dropdown click and no options', () => {
  setupIntersectionObserverMock();
  const onOptionSelect = jest.fn((option: InputSelectOption | null) => {});
  const inputSelectDropDown = findByTestId(getWrapper([], onOptionSelect), inputSelectDropdownTestId);

  inputSelectDropDown.simulate('click');
});

it('Renders without crashing with dropdown input type', () => {
  setupIntersectionObserverMock();
  const type = 'input';
  const onOptionSelect = jest.fn((option: InputSelectOption | null) => {});
  const onInputChange = jest.fn(() => {});
  const wrapper = getWrapper(testOption, onOptionSelect, type, false, true, onInputChange);
  const inputSelectInputFiled = findByTestId(wrapper, inputTestId);
  const inputSelectClearIcon = findByTestId(wrapper, inputSelectClearIconTestId);
  inputSelectInputFiled.simulate('change');
  inputSelectClearIcon.simulate('click');
});

it('Renders without crashing with on input option click', () => {
  setupIntersectionObserverMock();
  const type = 'input';
  const onOptionSelect = jest.fn((option: InputSelectOption | null) => {});
  const onInputChange = jest.fn(() => {});
  const wrapper = getWrapper(testOption, onOptionSelect, type, false, true, onInputChange);
  const inputSelectInputFiled = findByTestId(wrapper, inputTestId);
  inputSelectInputFiled.simulate('change');
  wrapper.update();
  const inputSelectOption = findByTestId(wrapper, inputSelectOptionTestId);
  inputSelectOption.simulate('click');
});

// TODO: test useEffects
