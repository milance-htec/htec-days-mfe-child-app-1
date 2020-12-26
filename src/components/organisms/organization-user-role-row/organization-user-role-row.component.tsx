import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Components */
import { ItemBox } from 'components/atoms';
import { LabeledCheckbox } from 'components/molecules';

/* Types and constats */
import { OrganizationUserRoleRowProps } from './organization-user-role-row.types';

/* Styles */
import './organization-user-role-row.scss';

export const OrganizationUserRoleRow: FunctionComponent<OrganizationUserRoleRowProps> = ({
  role,
  isSelected = false,
  onSelect,
  className,
  style,
}) => {
  const onItemSelect = (isActive: boolean) => {
    onSelect(role, isActive);
  };

  return (
    <ItemBox
      data-testid="organization-user-role-row"
      onActiveChange={onItemSelect}
      isActive={isSelected}
      className={classnames('organization-user-role-row-container', className)}
      style={style}
    >
      <LabeledCheckbox text={role.name} checked={isSelected}></LabeledCheckbox>
    </ItemBox>
  );
};
