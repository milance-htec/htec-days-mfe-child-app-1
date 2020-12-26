import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import { ItemBoxProps } from './item-box.types';

import './item-box.component.scss';

export const ItemBox: FunctionComponent<ItemBoxProps> = ({
  children,
  className,
  style,
  isActive = false,
  onActiveChange,
}) => {
  return (
    <div
      className={classnames('item-box', className, {
        active: isActive,
      })}
      data-testid="item-box"
      style={style}
      onClick={() => onActiveChange(!isActive)}
    >
      {children}
    </div>
  );
};
