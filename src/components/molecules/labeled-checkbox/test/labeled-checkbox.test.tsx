import React from 'react';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

/* Components */
import { LabeledCheckbox } from '../labeled-checkbox.component';

/* Constants */
import { CHECKBOX_TESTID } from 'components/atoms/checkbox/checkbox.constants';
import { LABELED_CHECKBOX_TESTID } from './../labeled-checkbox.constants';

/* Utility */
import { findByTestId, WithMaterialTheme } from 'common/test-utility';
import { ReefCloudTheme } from 'common/material-ui';

React.useLayoutEffect = React.useEffect;

afterEach(cleanup);

const testClass = 'labeled-checkbox-class';
const testStyle = { marginRight: '10px' };
const textTest = 'Test text';

const getWrapper = (onCheckboxClick?: (value: any) => void) => {
  return mount(
    WithMaterialTheme(
      <LabeledCheckbox className={testClass} style={testStyle} text={textTest} onChange={onCheckboxClick} />,
      ReefCloudTheme,
    ),
  );
};

it('Renders without crashing', () => {
  const labeledCheckbox = findByTestId(getWrapper(), LABELED_CHECKBOX_TESTID);

  expect(labeledCheckbox.hasClass(testClass)).toBeTruthy();
  expect(labeledCheckbox.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with checkbox click', () => {
  const onCheckboxClickMock = jest.fn((value: any) => {});
  const wrapper = getWrapper(onCheckboxClickMock);
  const checkboxInput = findByTestId(wrapper, CHECKBOX_TESTID);
  checkboxInput.simulate('change');
  expect(onCheckboxClickMock).toBeCalled();
});
