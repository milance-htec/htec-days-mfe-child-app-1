import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Types */
import { WindowContentContainerProps } from './window-content-container.types';

/* Styles */
import './window-content-container.scss';

export const WindowContentContainer: FunctionComponent<WindowContentContainerProps> = ({
  children,
  className,
  style,
}) => (
  <div
    data-testid="window-content-container"
    className={classnames('window-content-container', className)}
    style={style}
  >
    {children}
  </div>
);
