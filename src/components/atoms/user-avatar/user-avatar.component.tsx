import React, { FunctionComponent } from 'react';

import { UserAvatarProps } from './user-avatar.types';
import './user-avatar.component.scss';
import classnames from 'classnames';
import { getAvatarLetters } from './user-avatar.uitlity';

export const UserAvatar: FunctionComponent<UserAvatarProps> = ({
  className,
  email,
  firstName,
  fontSize = 'default',
  imageUrl,
  isUserActive,
  lastName,
  onClick,
  style,
}) => {
  return (
    <div
      style={{ ...style, backgroundImage: `url(${imageUrl || ''})` }}
      className={classnames('user-avatar', className, {
        'user-avatar--inactive-user': !isUserActive,
        'active-user': isUserActive,
      })}
      onClick={onClick}
      data-testid="user-avatar"
    >
      {imageUrl ? null : (
        <p className={`user-avatar__paragraph--${fontSize}`}>{getAvatarLetters({ email, firstName, lastName })}</p>
      )}
    </div>
  );
};
