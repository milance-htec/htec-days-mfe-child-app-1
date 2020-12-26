import React, { FunctionComponent } from 'react';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { Done, Clear } from '@material-ui/icons';

/* Components */
import { Icon } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { ToastMesageContentProps } from './toast-message-content.types';

/* Styles */
import './toast-message-content.scss';

export const ToastMessasgeContent: FunctionComponent<ToastMesageContentProps> = ({
  children,
  type = 'success',
  className,
  style,
}) => {
  const getMessageIcon = () => {
    if (type === 'success') {
      return (
        <Icon className="toast-message-content__icon toast-message-content__icon--success">
          <Done />
        </Icon>
      );
    } else {
      return (
        <Icon className="toast-message-content__icon toast-message-content__icon--error">
          <Clear />
        </Icon>
      );
    }
  };

  return (
    <Flex.Layout
      data-testid="toast-message"
      alignItems="center"
      className={classnames('toast-message-content', className)}
      style={style}
    >
      {getMessageIcon()}
      <span className="toast-message-content__message">{children}</span>
    </Flex.Layout>
  );
};

export function setToastMessage(message: string, type: 'success' | 'error' = 'success') {
  toast(<ToastMessasgeContent type={type}>{message}</ToastMessasgeContent>);
}
