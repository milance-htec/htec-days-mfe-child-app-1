import React, { useState, FunctionComponent, useContext } from 'react';
import classnames from 'classnames';
import { MoreHoriz, Edit } from '@material-ui/icons';

/* Components */
import { Icon, Dropdown, ItemHolder } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { RoleCardProps } from './role-card.types';
import { DropdownOption } from 'components/atoms/dropdown/dropdown.types';
import { OrganizationUsersPageQueryParams } from 'components/pages/organization-users/organization-users.types';

/* Constants */
import { ROLES_PAGE_USER_MODULE_OWNER, ROUTES } from 'common/constants';
import { ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS } from 'components/pages/organization-users/organization-users.constants';

/* Utility */
import { pluralStringHandler } from 'common/utility';
import { AppContext } from 'App';
import { useQueryParams } from 'common/hooks/useQueryParams';

/* Styles */
import './role-card.scss';

export const RoleCard: FunctionComponent<RoleCardProps> = ({
  className,
  deleteAction,
  editAction,
  manageModulesAction = () => {},
  role,
  hasOrganizationUsersPageViewPermission,
  hasOrganizationUsersPageOwnerPermission,
  onClick,
  style,
}) => {
  const [dropdownState, setDropdownState] = useState(false);

  const { doesUserHaveRequiredModules } = useContext(AppContext);

  const options: DropdownOption[] = [];

  const { ROLE } = ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS;

  const { setQueryParams } = useQueryParams<OrganizationUsersPageQueryParams>({
    baseUrlPredefined: ROUTES.ORGANIZATION_USERS,
    queryParamKeys: [ROLE],
  });

  if (doesUserHaveRequiredModules(ROLES_PAGE_USER_MODULE_OWNER)) {
    options.push({ name: 'Edit Role', action: editAction });
    options.push({ name: 'Delete Role', action: deleteAction });
  }

  const onDropdownClick = (dropdownStatus: any) => () => {
    setDropdownState(!dropdownStatus);
  };

  const onAddUsersClick = () => {
    if (hasOrganizationUsersPageOwnerPermission) {
      setQueryParams({ params: [] });
    }
  };

  const onUsersClick = () => {
    if (hasOrganizationUsersPageViewPermission || hasOrganizationUsersPageOwnerPermission) {
      setQueryParams({ params: [{ name: ROLE, value: role.id }] });
    }
  };

  return (
    <Flex.Layout
      data-testid="role-card"
      flexDirection="column"
      className={classnames('role-card', className)}
      style={style}
      onClick={onClick}
    >
      <Flex.Layout flex={1} className="role-card__header" flexDirection="column">
        <Flex.Layout alignItems="center" className="role-card__header--title-options-wrapper">
          <Flex.Layout alignItems="center" flexGrow={1} className="role-card__header-title">
            {role.name}
          </Flex.Layout>

          {/* Options dropdown */}
          {options.length ? (
            <Flex.Layout alignAll="center" className="role-card__header-options-menu">
              <Icon data-testid="role-card-dropdown-icon" onClick={onDropdownClick(dropdownState)}>
                <MoreHoriz />
              </Icon>
              <Dropdown
                options={options}
                onDropdownHide={onDropdownClick(dropdownState)}
                showDropdown={dropdownState}
              />
            </Flex.Layout>
          ) : null}
        </Flex.Layout>
        {role.description ? (
          <Flex.Layout className="role-card__header-description" flexGrow={1} alignItems="center">
            {role.description}
          </Flex.Layout>
        ) : null}
      </Flex.Layout>
      <Flex.Layout flexGrow={1} flexDirection="column" className="role-card__content">
        <Flex.Layout className="role-card__row" alignItems="center">
          {role.numberOfAssignedUsers ? (
            <Flex.Layout alignItems="center" flexGrow={1}>
              <ItemHolder
                className={classnames('role-card__row-item-number--users', {
                  'role-card__row-item-number--users-not-clickable':
                    !hasOrganizationUsersPageViewPermission && !hasOrganizationUsersPageOwnerPermission,
                })}
                onClick={onUsersClick}
              >
                {`${role.numberOfAssignedUsers} ${pluralStringHandler(role.numberOfAssignedUsers, 'User', 'Users')}`}
              </ItemHolder>
            </Flex.Layout>
          ) : (
            <Flex.Layout
              className={classnames('role-card__row--no-action', {
                'role-card__row--no-action-not-clickable': !hasOrganizationUsersPageOwnerPermission,
              })}
              alignItems="center"
              onClick={onAddUsersClick}
            >
              Add Users
            </Flex.Layout>
          )}
        </Flex.Layout>
        <Flex.Layout className="role-card__row" alignItems="center">
          {role.numberOfAssignedModules ? (
            <>
              <Flex.Layout alignItems="center" flexGrow={1}>
                <ItemHolder className="role-card__row-item-number">{`${role.numberOfAssignedModules} Modules/Submodules assigned`}</ItemHolder>
              </Flex.Layout>
              <Flex.Layout className="role-card__row-action" alignItems="center" onClick={manageModulesAction}>
                <Icon>
                  <Edit />
                </Icon>
              </Flex.Layout>
            </>
          ) : (
            <Flex.Layout className="role-card__row--no-action" alignItems="center" onClick={manageModulesAction}>
              Add Modules
            </Flex.Layout>
          )}
        </Flex.Layout>
      </Flex.Layout>
    </Flex.Layout>
  );
};
