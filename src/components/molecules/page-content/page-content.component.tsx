import React from 'react';
import classnames from 'classnames';

import { PageContentProps } from './page-content.types';

import './page-content.scss';

export const PageContent = React.forwardRef<HTMLDivElement, PageContentProps>(
  ({ children, style, className, scrollable, padding = true }, ref) => (
    <div
      data-testid="page-content"
      style={style}
      ref={ref}
      className={classnames('page-content', className, {
        'page-content--scrollable': scrollable,
        'page-content--padding': padding,
      })}
    >
      {children}
    </div>
  ),
);
