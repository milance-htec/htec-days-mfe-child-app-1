import { Role, RoleListItem } from '../../roles.types';

export interface DeleteRoleModalProps {
  modalState: boolean;
  onRoleDelete: () => void;
  role: RoleListItem | null;
  setLoaderState: (state: boolean) => void;
  setModalState: (state: boolean, role?: Role | null) => () => void;
  organizationId: number | null;
}

/* GraphQL */
export interface GQLDeleteRoleByIdResult {
  deleteOrganizationRole: boolean;
}

export interface GQLDeleteRoleByIdVariables {
  roleId: number;
  organizationId: number;
}
