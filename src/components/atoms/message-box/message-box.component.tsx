import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Types */
import { MessageBoxProps } from './message-box.types';

/* Styles */
import './message-box.scss';

export const MessageBox: FunctionComponent<MessageBoxProps> = ({ type = 'info', children, className, style }) => {
  return (
    <div
      className={classnames('message-box', className, `message-box--${type}`)}
      data-testid="message-box"
      style={style}
    >
      {children}
    </div>
  );
};
