import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import { TextProps } from './text.types';

import './text.component.scss';

export const Text: FunctionComponent<TextProps> = ({
  className,
  children,
  style,
  bold = false,
  underline = false,
  color = 'normal',
  onClick,
}) => (
  <span
    className={classnames('text', className, `text-color--${color}`, {
      'text--bold': bold,
      'text--underline': underline,
      'text--cursor-pointer': onClick,
    })}
    data-testid="text"
    onClick={onClick}
    style={style}
  >
    {children}
  </span>
);
