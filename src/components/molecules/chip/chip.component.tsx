import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Components */
import { Flex } from 'components/molecules';

/* Types and constants */
import { ChipProps } from './chip.types';

/* Styles */
import './chip.scss';

export const Chip: FunctionComponent<ChipProps> = ({
  bottomSpacing = true,
  children,
  className,
  color = 'purple-light',
  leftSpacing = false,
  onClick,
  rightSpacing = true,
  style,
  tooltip = '',
  topSpacing = false,
}) => {
  return (
    <Flex.Layout
      tooltip={tooltip}
      data-testid="chip"
      className={classnames('chip', className, `chip--${color}`, {
        'chip--left-spacing': leftSpacing,
        'chip--right-spacing': rightSpacing,
        'chip--top-spacing': topSpacing,
        'chip--bottom-spacing': bottomSpacing,
      })}
      style={style}
      onClick={onClick}
      alignItems="center"
    >
      {children}
    </Flex.Layout>
  );
};
