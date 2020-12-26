import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { KeyboardCapslock, Search, Visibility } from '@material-ui/icons';

/* Components */
import { Input, Icon } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { FormInputProps } from './form-input.types';

/* Utility */
import { isCapslock } from './form-input.utility';

/* Styles */
import './form-input.scss';

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      autoComplete = true,
      borderBottom = true,
      bottomSpacing,
      changed,
      className,
      defaultMessage,
      detectCapsLock,
      disabled,
      hasDebounce,
      hideTitle = false,
      id,
      inputClassName,
      inputStyle,
      max,
      maxLength,
      message,
      min,
      minLength,
      name,
      onBlur,
      onChange,
      onFocus,
      onKeyDown,
      onKeyPress,
      onKeyUp,
      onlyNumber,
      onTouched,
      placeholder,
      primary = true,
      searchIconOnClick,
      showInputMessage = true,
      showPasswordIcon,
      showTitleAlways = false,
      style,
      title = '',
      topSpacing,
      type = 'text',
      value,
    },
    ref,
  ) => {
    /* Input debounce */
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

    /* Password input type */
    const [showPassword, setShowPassword] = useState(false);

    /* Detect caps look */
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);

    /* Is input focused */
    const [isInputFocused, setIsInputFocused] = useState(false);

    const onTouchCallback = (field: string, isTouched?: boolean, shouldValidate?: boolean) => {
      if (onTouched) {
        if (hasDebounce) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          setTimeoutId(
            setTimeout(() => {
              onTouched(field, isTouched, shouldValidate);
            }, 400),
          );
        } else {
          onTouched(field, isTouched, shouldValidate);
        }
      }
    };

    const onVisibilityIconClick = () => {
      setShowPassword(!showPassword);
    };

    const getTitle = () => {
      if (showTitleAlways) {
        return title;
      }

      return !value ? '' : title || placeholder;
    };

    useEffect(() => {
      if (!value) {
        setShowPassword(false);
      }
    }, [value]);

    return (
      <Flex.Layout
        data-testid="form-input"
        className={classnames('form-input', className, {
          'form-input__bottom-spacing': bottomSpacing,
          'form-input__top-spacing': topSpacing,
        })}
        style={style}
        flexDirection="column"
      >
        {/* Input title */}
        {type !== 'search' && !hideTitle ? (
          <div
            className={classnames('form-input__title', {
              'form-input__title--disabled': disabled,
              'form-input__title--default-color': !changed,
            })}
          >
            {getTitle()}
          </div>
        ) : null}

        {type === 'search' ? (
          <Flex.Layout className="input-search" alignItems="center" justifyContent="center">
            <Input
              autoComplete={autoComplete}
              borderBottom={borderBottom}
              className={inputClassName}
              data-testid="form-input-search"
              disabled={disabled}
              error={message && message.type === 'error'}
              hasDefaultBorder={!value}
              id={id}
              max={max}
              maxLength={maxLength}
              min={min}
              minLength={minLength}
              name={name}
              onlyNumber={onlyNumber}
              placeholder={placeholder}
              primary={primary}
              ref={ref}
              style={inputStyle}
              type="text"
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onKeyPress={onKeyPress}
              onKeyUp={onKeyUp}
              onTouched={onTouchCallback}
              onBlur={(e) => {
                setIsInputFocused(false);

                if (onBlur) {
                  onBlur(e);
                }
              }}
              onFocus={(e) => {
                setIsInputFocused(true);

                if (onFocus) {
                  onFocus(e);
                }
              }}
            />
            <Icon
              onClick={searchIconOnClick}
              className={classnames('form-input__search-icon', {
                'form-input__search-icon--has-value': value,
                'form-input__search-icon--error': message && message.type === 'error',
              })}
            >
              <Search />
            </Icon>
          </Flex.Layout>
        ) : null}

        {/* Text and Number input */}
        {type === 'text' ? (
          <Input
            id={id}
            data-testid="form-input-text"
            autoComplete={autoComplete}
            borderBottom={borderBottom}
            className={inputClassName}
            disabled={disabled}
            error={message && message.type === 'error'}
            hasDefaultBorder={!changed}
            max={max}
            maxLength={maxLength}
            min={min}
            minLength={minLength}
            name={name}
            onlyNumber={onlyNumber}
            placeholder={placeholder}
            primary={primary}
            style={inputStyle}
            type={type}
            value={value}
            ref={ref}
            onChange={onChange}
            onKeyDown={onKeyDown}
            onKeyPress={onKeyPress}
            onKeyUp={onKeyUp}
            onTouched={onTouchCallback}
            onBlur={(e) => {
              setIsInputFocused(false);

              if (onBlur) {
                onBlur(e);
              }
            }}
            onFocus={(e) => {
              setIsInputFocused(true);

              if (onFocus) {
                onFocus(e);
              }
            }}
          />
        ) : null}

        {/* Password input */}
        {type === 'password' ? (
          <Flex.Layout
            alignItems="center"
            className={classnames('form-input__password-input', {
              'form-input__password-input--border-bottom': borderBottom,
              'form-input__password-input--has-value': borderBottom && value && (!message || message.type !== 'error'),
              'form-input__password-input--has-error': borderBottom && message && message.type === 'error',
            })}
          >
            <Input
              id={id}
              data-testid="form-input-password"
              hasDefaultBorder={!changed}
              autoComplete={autoComplete}
              borderBottom={false}
              className={inputClassName}
              disabled={disabled}
              maxLength={maxLength}
              minLength={minLength}
              name={name}
              placeholder={placeholder}
              primary={primary}
              style={inputStyle}
              type={showPassword ? 'text' : 'password'}
              value={value}
              ref={ref}
              onChange={onChange}
              onKeyPress={onKeyPress}
              onKeyUp={onKeyUp}
              onKeyDown={(e) => {
                // Detect caps lock and set icon state
                if (detectCapsLock) {
                  setIsCapsLockOn(isCapslock(e));
                }

                if (onKeyDown) {
                  onKeyDown(e);
                }
              }}
              onBlur={(e) => {
                setIsInputFocused(false);

                if (onBlur) {
                  onBlur(e);
                }
              }}
              onFocus={(e) => {
                setIsInputFocused(true);

                if (onFocus) {
                  onFocus(e);
                }
              }}
              onTouched={onTouched}
            />

            {/* Show caps lock icon */}
            {detectCapsLock && isCapsLockOn && isInputFocused ? (
              <Icon className="form-input__password-input-visibility-icon">
                <KeyboardCapslock />
              </Icon>
            ) : null}

            {/* Show password icon */}
            {showPasswordIcon && value ? (
              <Icon
                data-testid="form-input-visibility-icon"
                className={classnames('form-input__password-input-visibility-icon', {
                  'form-input__password-input-visibility-icon--visible': showPassword,
                })}
                onClick={onVisibilityIconClick}
              >
                <Visibility />
              </Icon>
            ) : null}
          </Flex.Layout>
        ) : null}

        {/* Input message */}
        {showInputMessage ? (
          <Flex.Layout
            className={classnames('form-input__message', {
              'form-input__message--error':
                (message && message.type === 'error') || (defaultMessage && defaultMessage.type === 'error'),
              'form-input__message--success':
                (message && message.type === 'success') || (defaultMessage && defaultMessage.type === 'success'),
            })}
            alignItems="flex-start"
          >
            {(message && message.message) || (defaultMessage && defaultMessage.message)}
          </Flex.Layout>
        ) : null}
      </Flex.Layout>
    );
  },
);
