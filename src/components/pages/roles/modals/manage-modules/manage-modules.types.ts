import { RolesPageQueryParams, SetManageRoleModulesModalStateProps, RoleModules } from '../../roles.types';

export interface ManageModulesModalProps {
  modalState: boolean;
  onSaveRoleModules: () => void;
  queryParams: RolesPageQueryParams;
  roleModulesData: RoleModules | null;
  setLoaderState: (state: boolean) => void;
  setModalState: (state: boolean, modalOptions?: SetManageRoleModulesModalStateProps) => () => void;
  organizationId: number | null;
}

/* GraphQL */
export interface GQLSaveRoleModulesResult {
  updateOrganizationRoleModules: boolean | null;
}

export interface SaveRoleModulesModule {
  id: number;
  permissionLevel: string;
  subModules?: SaveRoleModulesModule[];
}

export interface GQLSaveRoleModulesVariables {
  modules: SaveRoleModulesModule[];
  organizationId: number;
  roleId: number;
}
