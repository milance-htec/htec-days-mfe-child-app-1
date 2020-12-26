import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Types */
import { BreadcrumbsProps } from './breadcrumbs.types';

/* Styles */
import './breadcrumbs.scss';

export const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = ({ crumbs, className, style }) => {
  return (
    <div data-testid="breadcrumbs" className={classnames('breadcrumbs', className)} style={style}>
      {crumbs.map((crumb, index) => {
        if (typeof crumb === 'string') {
          return (
            <span data-testid={`breadcrumbs-crumb-${index}`} key={index} className="breadcrumbs__crumb">
              &nbsp;{crumb}&nbsp;
              {index < crumbs.length - 1 ? '>' : ''}
            </span>
          );
        } else if (typeof crumb === 'object') {
          return (
            <span
              data-testid={`breadcrumbs-crumb-${index}`}
              className="breadcrumbs__crumb"
              onClick={crumb.onClick}
              key={index}
            >
              <span className="breadcrumbs__crumb--clickable">&nbsp;{crumb.title}&nbsp;</span>
              {index < crumbs.length - 1 ? '>' : ''}
            </span>
          );
        }

        return null;
      })}
    </div>
  );
};
