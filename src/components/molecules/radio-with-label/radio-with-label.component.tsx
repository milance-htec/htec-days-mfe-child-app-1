import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import { Radio, Text } from 'components/atoms';
import { Flex } from 'components/molecules';

import { RadioWithLabelProps } from './radio-with-label.types';

import './radio-with-label.scss';

export const RadioWithLabel: FunctionComponent<RadioWithLabelProps> = ({
  className,
  style,
  classNameRadio,
  classNameLabel,
  group = 'group1',
  onChange,
  label,
  checked,
  value,
  disabled,
}) => (
  <label
    data-testid="radio-with-label"
    className={classnames('radio-with-label', className, {
      'is-disabled': disabled,
      'is-checked': checked,
    })}
    style={style}
  >
    <Flex.Layout justifyContent="flex-start">
      <Radio
        className={classNameRadio}
        group={group}
        onChange={onChange}
        checked={checked}
        value={value}
        disabled={disabled}
      />
      <Text className={classnames(classNameLabel, {})}>{label}</Text>
    </Flex.Layout>
  </label>
);
