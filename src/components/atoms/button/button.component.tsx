import React, { forwardRef } from 'react';
import { useHistory } from 'react-router-dom';

import { Button as MuiButton } from '@material-ui/core';

/* Types */
import { ButtonProps } from './button.types';

/* Constants */
import { BUTTON_TESTID } from './button.constants';

/* Styles */
import { useStylesButton } from './button.styles';

export const Button = forwardRef<any, ButtonProps>(
  (
    {
      bottomSpacing,
      children,
      disabled = false,
      endIcon,
      href,
      id,
      linkActionType = 'push',
      onClick,
      qaName,
      startIcon,
      testId = BUTTON_TESTID,
      topSpacing,
      type = 'button',
      variant = 'primary',
    },
    ref,
  ) => {
    const classes = useStylesButton({
      bottomSpacing,
      topSpacing,
      variant,
    });

    const history = useHistory();

    return (
      <MuiButton
        classes={classes}
        data-qa-name={qaName}
        data-testid={testId}
        disabled={disabled}
        endIcon={endIcon}
        id={id}
        onClick={(e) => {
          if (href) {
            e.preventDefault();

            if (linkActionType === 'push') {
              history.push(href);
            } else {
              history.replace(href);
            }
          }

          if (onClick) {
            onClick(e);
          }
        }}
        ref={ref}
        startIcon={startIcon}
        type={type}
        href={href}
      >
        {children}
      </MuiButton>
    );
  },
);
