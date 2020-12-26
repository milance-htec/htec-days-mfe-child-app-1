import React, { FunctionComponent } from 'react';
import classnames from 'classnames';
import { Clear } from '@material-ui/icons';

/* Components */
import { Icon, UserAvatar } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { CardsInputChipProps } from './cards-input-chip.types';

/* Styles */
import './cards-input-chip.scss';

export const CardsInputChip: FunctionComponent<CardsInputChipProps> = ({
  children,
  avatarTitle,
  tooltip,
  className,
  avatarImage,
  style,
  type = 'blue',
  onRemoveClick,
}) => {
  let firstName = '';
  let lastName = '';

  if (avatarTitle) {
    firstName = avatarTitle.split(' ')[0];
    lastName = avatarTitle.split(' ')[1];
  }

  return (
    <Flex.Layout
      data-testid="cards-input-chip"
      tooltip={tooltip}
      alignItems="center"
      className={classnames('cards-input-chip', className, `cards-input-chip--${type}`, {
        'cards-input-chip--with-avatar': avatarImage || avatarTitle,
      })}
      style={style}
    >
      {avatarTitle || avatarImage ? (
        <UserAvatar
          firstName={firstName}
          lastName={lastName}
          isUserActive
          fontSize="default"
          className="cards-input-chip__avatar"
        />
      ) : null}
      {children}
      <Icon data-testid="cards-input-chip-icon" onClick={onRemoveClick}>
        <Clear className="cards-input-chip__icon" />
      </Icon>
    </Flex.Layout>
  );
};
