import React, { FunctionComponent } from 'react';

import { AtomProps } from './atom.types';
import './atom.component.scss';
import classnames from 'classnames';

export const Atom: FunctionComponent<AtomProps> = ({ onClick, className, style }) => (
  <div data-testid="atom" style={style} className={classnames('atom', className)} onClick={onClick}>
    Text
  </div>
);
