import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Component */
import Flex from '../flex';

/* Types */
import { UserProfileModalContentProps } from './user-profile-modal-content.types';

/* Styles */
import './user-profile-modal-content.scss';

export const UserProfileModalContent: FunctionComponent<UserProfileModalContentProps> = ({
  children,
  className,
  description,
  descriptionBottomGap = 'normal',
  title,
}) => {
  return (
    <Flex.Item flexGrow={1} className={classnames('user-profile-modal-content', className)}>
      <div className="user-profile-modal-content__heading">{title}</div>
      <div
        className={classnames('user-profile-modal-content__description', {
          [`user-profile-modal-content__description--bottom-gap-${descriptionBottomGap}`]: true,
        })}
      >
        {description}
      </div>
      {children}
    </Flex.Item>
  );
};
