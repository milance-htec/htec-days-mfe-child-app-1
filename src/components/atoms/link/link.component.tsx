import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Types */
import { LinkProps } from './link.types';

/* Utility */

/* Styles */
import './link.component.scss';
import { useHistory } from 'react-router-dom';

export const Link: FunctionComponent<LinkProps> = ({ href, className, children, bold = false, onClick, style }) => {
  const history = useHistory();

  return (
    <a
      data-testid="link"
      className={classnames('link', className, {
        'link--bold': bold,
      })}
      href={href !== '' ? href : undefined}
      onClick={(e) => {
        e.preventDefault();

        if (onClick) {
          onClick(e);
        }

        if (href) {
          history.push(href);
        }
      }}
      style={style}
    >
      {children}
    </a>
  );
};
