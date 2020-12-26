import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

import { LayoutProps, ItemProps } from './flex.types';

import './flex.scss';

const Layout: FunctionComponent<LayoutProps> = ({
  alignAll,
  alignItems,
  alignSelf,
  children,
  className,
  flex,
  flexBasis,
  flexDirection,
  flexGrow,
  flexShrink,
  flexWrap,
  justifyContent,
  onClick,
  qaName,
  style,
  tooltip = '',
  width,
}) => {
  let flexProps: any = {};

  if (flex !== undefined) {
    flexProps = { flex };
  } else if (flexGrow || flexShrink || flexBasis) {
    flexProps = {
      flexGrow,
      flexShrink,
      flexBasis,
    };
  }

  return (
    <div
      data-testid="flex-layout"
      title={tooltip}
      onClick={onClick}
      className={classnames('flex-layout', className)}
      data-qa-name={qaName}
      style={{
        ...style,
        alignItems: alignAll ? alignAll : alignItems,
        flexDirection,
        width,
        ...flexProps,
        flexWrap,
        justifyContent: alignAll ? alignAll : justifyContent,
        alignSelf,
      }}
    >
      {children}
    </div>
  );
};

const Item: FunctionComponent<ItemProps> = ({
  alignAll,
  alignItems,
  alignSelf,
  children,
  className,
  display,
  flex,
  flexBasis,
  flexDirection,
  flexGrow,
  flexShrink,
  flexWrap,
  horizontalSpacing = false,
  justifyContent,
  style,
  width,
}) => {
  let flexProps: any = {};

  if (flex !== undefined) {
    flexProps = { flex };
  } else if (flexGrow || flexShrink || flexBasis) {
    flexProps = {
      flexGrow,
      flexShrink,
      flexBasis,
    };
  }

  return (
    <div
      data-testid="flex-item"
      className={classnames('flex-item', className, {
        'flex-item--horizontal-spacing': horizontalSpacing,
      })}
      style={{
        ...style,
        ...flexProps,
        alignItems: alignAll ? alignAll : alignItems,
        alignSelf,
        display,
        flexDirection,
        flexWrap,
        justifyContent: alignAll ? alignAll : justifyContent,
        minWidth: width,
        width,
      }}
    >
      {children}
    </div>
  );
};

// eslint-disable-next-line
export default {
  Layout,
  Item,
};
