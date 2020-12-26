import { BaseComponentProps } from 'common/types';
import { DropdownOptionAction } from 'components/atoms/dropdown/dropdown.types';
import { RoleListItem } from 'components/pages/roles/roles.types';

export interface RoleCardProps extends BaseComponentProps {
  role: RoleListItem;
  editAction: DropdownOptionAction;
  deleteAction: DropdownOptionAction;
  hasOrganizationUsersPageViewPermission?: boolean;
  hasOrganizationUsersPageOwnerPermission?: boolean;
  usersCount?: number;
  modulesCount?: number;
  manageModulesAction?: () => void;
}
