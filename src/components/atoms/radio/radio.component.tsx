import React, { FunctionComponent } from 'react';

import { RadioProps } from './radio.types';
import './radio.component.scss';
import classnames from 'classnames';

export const Radio: FunctionComponent<RadioProps> = ({
  onClick,
  className,
  style,
  group,
  onChange,
  checked,
  value,
  disabled,
}) => {
  return (
    <input
      data-testid="radio"
      type="radio"
      style={style}
      className={classnames('radio', className)}
      onClick={onClick}
      name={group}
      onChange={onChange}
      readOnly={!onChange ? true : false}
      checked={checked}
      value={value}
      disabled={disabled}
    />
  );
};
