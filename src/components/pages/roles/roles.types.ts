import { PaginationResponse } from 'common/types';
import { BaseQueryParameters } from 'common/hooks/useQueryParams';
import { OrganizationModule } from '../organizations/organizations.types';

export interface RolesPageQueryParams extends BaseQueryParameters {
  manageRoleModules: string | null;
  page: string | null;
  role: string | null;
  search: string | null;
  size: string | null;
  view: RolesPageViewQueryParam | null;
}

export type RolesPageViewQueryParam = 'list' | 'tiles';

export type RoleModalFormValues = {
  description?: string;
  name?: string;
};

/* API calls responses */
export interface RoleListItem {
  id: string;
  name: string;
  description: string;
  numberOfAssignedModules: number;
  numberOfAssignedUsers: number;
}

export interface Role extends RoleListItem {
  description: string;
}

export interface RoleModules {
  description: string;
  id: string;
  modules: Module[];
  name: string;
}

export interface Module {
  id: string;
  name: string;
  numberOfAssignedModules: number;
  numberOfModules: number;
  permissionLevel: string;
  status?: string;
  subModules?: Module[];
}

export interface RoleNameCheck {
  roleNameExists: boolean;
}

export interface SetCreateUpdateRoleModalStateProps {
  callback?: () => void;
  clearParams?: boolean;
  formData?: RoleModalFormValues;
}

export interface SetManageRoleModulesModalStateProps {
  // callback?: () => void;
  clearQueryManageRoleModulesId?: boolean;
}

export interface SetDeleteRoleModalStateProps {
  clearQueryDeleteRole?: boolean;
  roleData?: Role;
}

/* GraphQL */

// Get Roles list
export interface GQLGetRolesListResult {
  organizationRolesPage: PaginationResponse<RoleListItem> | null;
}

export interface GQLGetRolesListVariables {
  organizationId: string;
  name?: string;
  pageNumber?: number;
  pageSize?: number;
}

// Check role name avaiability
export interface GQLCheckRoleNameAvailabilityResult {
  findOrganizationRoleName: { name: string } | null;
}

export interface GQLCheckRoleNameAvailabilityVariables {
  organizationId: number;
  name: string;
}

// Create role
export interface RoleCreateRoleResult {
  id: string;
  name: string;
}
export interface GQLCreateRoleResult {
  addOrganizationRole: RoleCreateRoleResult | null;
}

export interface GQLCreateRoleVariables {
  description?: string;
  name: string;
  organizationId: number;
}

// Get role by id
export interface RoleGetRoleByIdResult {
  description: string;
  id: string;
  name: string;
}
export interface GQLGetRoleByIdResult {
  findOrganizationRoleById: RoleGetRoleByIdResult | null;
}

export interface GQLGetRoleByIdVariables {
  organizationId: number;
  roleId: number;
}

// Edit role by id
export interface GQLEditRoleResult {
  updateOrganizationRole: any | null;
}

export interface GQLEditRoleVariables {
  description?: string;
  name?: string;
  organizationId: number;
  roleId: number;
}

// Get role modules
export interface GQLGetRoleModulesResult {
  findOrganizationRoleModules: RoleModules | null;
}

export interface GQLGetRoleModulesVariables {
  organizationId: string;
  roleId: string;
}

//Get organization modules
export interface GQLGetOrganizationModulesResult {
  organizationModules: PaginationResponse<OrganizationModule> | null;
}

export interface GQLGetOrganizationModulesVariables {
  organizationId: string;
  pageNumber: number;
  pageSize: number;
}
