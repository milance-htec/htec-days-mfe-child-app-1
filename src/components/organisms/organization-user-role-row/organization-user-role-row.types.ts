import { BaseComponentProps } from 'common/types';
import { RoleListItem } from 'components/pages/roles/roles.types';

export interface OrganizationUserRoleRowProps extends BaseComponentProps {
  role: RoleListItem;
  isSelected?: boolean;
  onSelect: (role: RoleListItem, isSelected: boolean) => void;
}
