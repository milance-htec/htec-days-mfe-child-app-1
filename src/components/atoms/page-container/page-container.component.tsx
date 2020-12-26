import React from 'react';
import classnames from 'classnames';

import { PageContainerProps } from './page-container.types';

import './page-container.scss';

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ scrollable = false, children, className, style, flex, flexDirection = 'column' }, ref) => (
    <div
      style={style}
      ref={ref}
      data-testid="page-container"
      className={classnames('page-container', className, {
        'page-container--scrollable': scrollable,
        'page-container--flex': flex,
        'page-container--flex-direction-row': flexDirection === 'row',
        'page-container--flex-direction-column': flexDirection === 'column',
      })}
    >
      {children}
    </div>
  ),
);
