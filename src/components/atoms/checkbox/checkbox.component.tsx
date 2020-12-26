import React, { forwardRef } from 'react';
import { Checkbox as MuiCheckbox } from '@material-ui/core';

/* Constants */
import { CHECKBOX_TESTID } from './checkbox.constants';

/* Types */
import { CheckboxProps } from './checkbox.types';

/* Styles */
import { useStylesCheckbox } from './checkbox.styles';
import './checkbox.component.scss';

export const Checkbox = forwardRef<any, CheckboxProps>(
  ({ disabled, checked, onChange, value, qaName, icon, checkedIcon, id, testId = CHECKBOX_TESTID }, ref) => {
    const classes = useStylesCheckbox();

    return (
      <MuiCheckbox
        inputProps={{ 'data-testid': testId } as any}
        checked={checked}
        checkedIcon={checkedIcon}
        classes={classes}
        color="default"
        data-qa-name={qaName}
        disabled={disabled}
        icon={icon}
        ref={ref}
        value={value}
        onChange={(e) => {
          if (onChange) {
            onChange(e, e.target.checked, value);
          }
        }}
      />
    );
  },
);
