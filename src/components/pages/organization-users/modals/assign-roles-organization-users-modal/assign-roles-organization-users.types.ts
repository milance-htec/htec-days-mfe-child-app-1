import { ModalBaseProps } from 'common/types';
import { OrganizationUser } from '../../organization-users.types';

export interface AssignRolesOrganizationUsersModalProps extends ModalBaseProps {
  organizationUser: OrganizationUser | null;
  onAssignUserRolesDone: (isDone: boolean) => void;
}

/* GraphQL */
export type GQLUpdateUserRolesResult = {
  assignRoles: boolean | null;
};

export type GQLUpdateUserRolesVariables = {
  userId: number;
  rolesList: number[];
  organizationId: number;
};
