import React from 'react';

import { mount } from 'enzyme';
import { cleanup } from '@testing-library/react';

/* Components */
import { Checkbox } from '../checkbox.component';

/* Constants */
import { CHECKBOX_TESTID } from './../checkbox.constants';

/* Types */
import { CheckboxOnChange, CheckboxProps } from '../checkbox.types';

/* Utility */
import { findByTestId, WithMaterialTheme } from 'common/test-utility';
import { ReefCloudTheme } from 'common/material-ui';

React.useLayoutEffect = React.useEffect;

afterEach(cleanup);

const getWrapper = (changeHandler?: CheckboxOnChange) => {
  return mount<CheckboxProps>(
    WithMaterialTheme(<Checkbox value={5} checked={true} onChange={changeHandler} />, ReefCloudTheme),
  );
};

it('Emit value when changed', () => {
  const testCheckboxChnage = jest.fn(() => {});
  const wrapper = getWrapper(testCheckboxChnage);
  const input = findByTestId(wrapper, CHECKBOX_TESTID);
  input.simulate('change');
  expect(testCheckboxChnage).toBeCalled();
});

it('Not emit value when change handler is not defined', () => {
  const wrapper = getWrapper();
  const input = findByTestId(wrapper, CHECKBOX_TESTID);
  input.simulate('change');
  const state = wrapper.prop('onChange');
  expect(state).toBe(undefined);
});
