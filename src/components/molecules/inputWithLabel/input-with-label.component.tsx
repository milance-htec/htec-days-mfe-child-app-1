import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import { Input, Paragraph } from 'components/atoms';

import { InputWithLabelProps } from './input-with-label.types';

import './input-with-label.scss';

export const InputWithLabel: FunctionComponent<InputWithLabelProps> = ({
  className,
  classNameInput,
  classNameLabel,
  inputAudoComplete = true,
  inputDisabled = false,
  inputMax,
  inputMaxLength,
  inputMin,
  inputMinLength,
  message,
  name = 'email',
  onChange,
  onKeyPress,
  onTouched,
  placeholder,
  type = 'text',
  value = '',
  style,
}) => (
  <label data-testid="input-with-label" className={classnames('input-with-label', className)} style={style}>
    <Input
      data-testid="input-with-label-input"
      autoComplete={inputAudoComplete}
      className={classNameInput}
      disabled={inputDisabled}
      max={inputMax}
      maxLength={inputMaxLength}
      min={inputMin}
      minLength={inputMinLength}
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      onTouched={onTouched}
    />
    <Paragraph
      className={classnames(classNameLabel, {
        'input-with-label__message--error': message?.type === 'error',
        'input-with-label__message--success': message?.type === 'success',
      })}
    >
      {message ? message.message : ''}
    </Paragraph>
  </label>
);
