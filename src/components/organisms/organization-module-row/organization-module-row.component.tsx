import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Components */
import { ItemBox } from 'components/atoms';
import { LabeledCheckbox } from 'components/molecules';

/* Types and constats */
import { OrganizationModuleRowProps } from './organization-module-row.types';

/* Styles */
import './organization-module-row.scss';

export const OrganizationModuleRow: FunctionComponent<OrganizationModuleRowProps> = ({
  module,
  isSelected = false,
  onSelect,
  className,
  style,
}) => {
  const onItemBoxClick = (isActive: boolean) => {
    onSelect(module, isActive);
  };

  return (
    <ItemBox
      data-testid="organization-module-row"
      onActiveChange={onItemBoxClick}
      isActive={isSelected}
      className={classnames('organization-module-row-container', className)}
      style={style}
    >
      <LabeledCheckbox text={module.name} checked={isSelected}></LabeledCheckbox>
    </ItemBox>
  );
};
