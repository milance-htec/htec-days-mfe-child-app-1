import React from 'react';
import classnames from 'classnames';

/* Types */
import { InputProps } from './input.types';

/* Stypes */
import './input.component.scss';

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      autoComplete = true,
      borderBottom = true,
      className,
      disabled,
      error,
      hasDefaultBorder,
      max,
      maxLength,
      min,
      minLength,
      name = '',
      onChange,
      onKeyDown,
      onFocus,
      onKeyPress,
      onKeyUp,
      onlyNumber,
      onTouched,
      onBlur,
      placeholder,
      placeholderLeftPadding,
      primary = true,
      style,
      type = 'text',
      value = '',
    },
    ref,
  ) => (
    <input
      autoComplete={autoComplete ? 'on' : 'off'}
      data-testid="input"
      disabled={disabled}
      max={max}
      maxLength={maxLength}
      min={min}
      minLength={minLength}
      name={name}
      placeholder={placeholder}
      ref={ref}
      style={style}
      type={type}
      value={value}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onKeyPress={onKeyPress}
      onKeyUp={onKeyUp}
      onChange={(e) => {
        if (onChange) {
          // Validate if input should be only number
          if (!onlyNumber || (onlyNumber && /^\d*\d*$/.test(e.target.value))) {
            onChange(e);
          }
        }

        if (onTouched) {
          setTimeout(() => {
            onTouched(name, true);
          });
        }
      }}
      className={classnames('input', className, {
        'input--default-border': hasDefaultBorder,
        'input--has-value': value && borderBottom && !error,
        'input--has-error': borderBottom && error,
        'input--disabled': disabled,
        'input--no-border-bottom': !borderBottom,
        'input--planceholder-left-padding': placeholderLeftPadding,
        'input--primary': primary,
      })}
    />
  ),
);
