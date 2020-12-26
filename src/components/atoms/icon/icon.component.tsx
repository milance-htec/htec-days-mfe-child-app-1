import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import { IconProps } from './icon.types';

import './icon.component.scss';

export const Icon: FunctionComponent<IconProps> = ({ onClick, qaName, className, style, children }) => (
  <span
    data-testid="icon"
    data-qa-name={qaName}
    style={style}
    className={classnames('icon', className, {
      'icon--clickable': onClick !== undefined,
    })}
    onClick={onClick}
  >
    {children}
  </span>
);
