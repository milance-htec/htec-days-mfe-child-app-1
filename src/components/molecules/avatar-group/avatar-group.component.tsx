import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Components */
import { UserAvatar } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { AvatarGroupTypes } from './avatar-group.types';

/* Styles */
import './avatar-group.scss';

export const AvatarGroup: FunctionComponent<AvatarGroupTypes> = ({ className, style, avatarsInfo }) => {
  return (
    <Flex.Layout
      data-testid="avatar-group"
      className={classnames('avatar-group', className, {
        'avatar-group--single': avatarsInfo.length === 1,
      })}
      style={style}
    >
      {avatarsInfo &&
        avatarsInfo.map((avatar, index) => (
          <UserAvatar
            key={index}
            firstName={avatar.firstName}
            lastName={avatar.lastName}
            email={avatar.name}
            className="avatar-group__avatar"
            style={{ left: `${-index / 2}rem ` }}
          ></UserAvatar>
        ))}
    </Flex.Layout>
  );
};
