import React from 'react';
import { cleanup } from '@testing-library/react';
import {
  DateRangePicker,
  DATERANGE_PICKER_DAY_TEST_ID,
  DATERANGE_PICKER_TEST_ID,
  DATERANGE_PICKER_CLEAR_TEST_ID,
} from '../datepicker-range.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'chip-class';
const testStyle = { marginRight: '10px' };

const getWrapper = (isOpen: boolean, onChange: (date: any) => void, setIsOpen: (state: boolean) => void) => {
  return mount(
    <DateRangePicker
      onChange={onChange}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className={testClass}
      style={testStyle}
    />,
  );
};

it('Renders without crashing', () => {
  const onChangeTest = jest.fn((date: any) => {});
  const setIsOpenTest = jest.fn((state: boolean) => {});
  const daterangePicker = findByTestId(
    getWrapper(false, onChangeTest, setIsOpenTest),
    DATERANGE_PICKER_TEST_ID,
  ).first();

  expect(daterangePicker.hasClass(testClass)).toBeTruthy();
  expect(daterangePicker.prop('style')).toEqual(testStyle);
});

it('Renders without crashing when opened', async () => {
  const onChangeTest = jest.fn((date: any) => {});
  const setIsOpenTest = jest.fn((state: boolean) => {});
  const daterangePicker = findByTestId(getWrapper(true, onChangeTest, setIsOpenTest), DATERANGE_PICKER_TEST_ID).first();
  expect(daterangePicker.prop('open')).toBeTruthy();
});

it('Renders without crashing when opened and cleared selected dates', () => {
  const onChangeTest = jest.fn((date: any) => {});
  const setIsOpenTest = jest.fn((state: boolean) => {});
  const wrapper = getWrapper(true, onChangeTest, setIsOpenTest);
  const daterangePickerDayOne = findByTestId(wrapper, `${DATERANGE_PICKER_DAY_TEST_ID}-1`).first();
  const daterangePickerDayTen = findByTestId(wrapper, `${DATERANGE_PICKER_DAY_TEST_ID}-10`).first();
  daterangePickerDayTen.simulate('mouseover');
  daterangePickerDayTen.simulate('click');
  daterangePickerDayOne.simulate('mouseenter');
  daterangePickerDayOne.simulate('click');
  daterangePickerDayTen.simulate('click');
  const daterangePickerClear = findByTestId(wrapper, DATERANGE_PICKER_CLEAR_TEST_ID).first();
  daterangePickerClear.simulate('click');
});
