import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import { ItemHolderProps } from './item-holder.types';

import './item-holder.scss';

export const ItemHolder: FunctionComponent<ItemHolderProps> = ({
  bottomSpacing = false,
  children,
  className,
  leftSpacing = false,
  onClick,
  rightSpacing = false,
  style,
  topSpacing = false,
}) => {
  return (
    <div
      style={style}
      data-testid="item-holder"
      className={classnames('item-holder', className, {
        'item-holder__left-spacing': leftSpacing,
        'item-holder__right-spacing': rightSpacing,
        'item-holder__top-spacing': topSpacing,
        'item-holder__bottom-spacing': bottomSpacing,
      })}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
