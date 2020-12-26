import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Components */
import { Checkbox } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Constants */
import { LABELED_CHECKBOX_TESTID } from './labeled-checkbox.constants';

/* Types */
import { LabeledCheckboxProps } from './labeled-checkbox.types';
import { CheckboxOnChange } from 'components/atoms/checkbox/checkbox.types';

/* Styles */
import './labeled-checkbox.component.scss';

export const LabeledCheckbox: FunctionComponent<LabeledCheckboxProps> = ({
  checked,
  className,
  onChange,
  qaName,
  style,
  text,
  textOnLeftSide,
  value,
}) => {
  const onCheckboxChange: CheckboxOnChange = (e, isChecked, checkboxValue) => {
    if (onChange) {
      onChange(e, isChecked, checkboxValue);
    }
  };

  return (
    <Flex.Layout
      className={classnames(className)}
      data-testid={LABELED_CHECKBOX_TESTID}
      qaName={qaName}
      alignItems="center"
      style={style}
    >
      {textOnLeftSide ? text : ''}
      <Checkbox
        className={classnames({
          'labeled-checkbox--right-margin': !textOnLeftSide,
          'labeled-checkbox--left-margin': textOnLeftSide,
        })}
        value={value}
        checked={checked}
        onChange={onCheckboxChange}
      ></Checkbox>
      {!textOnLeftSide ? text : ''}
    </Flex.Layout>
  );
};
