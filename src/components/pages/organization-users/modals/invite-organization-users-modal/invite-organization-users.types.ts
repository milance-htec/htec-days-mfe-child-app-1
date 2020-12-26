import { ModalBaseProps, PaginationResponse, UserStatus } from 'common/types';

export interface InviteOrganizationUsersModalProps extends ModalBaseProps {
  onInviteOrganizationUsersDone: (props: InviteOrganizationUsersSummary, roleId: InviteUserRole) => void;
  setLoaderState: (state: boolean) => void;
}

export interface UserEmailItem {
  email: string;
  name?: string;
  username?: string;
}

/* GraphQL types */

// Find user by email
export interface GQLFindOrganizationUserByEmailResult {
  findOrganizationUserByEmail: FoundOrganizationUser;
}

interface FoundOrganizationUser {
  email: string;
  fullName: string;
  username: string;
  userStatus: UserStatus;
}

export interface GQLFindOrganizationUserByEmailVariables {
  organizationId: number;
  email: string;
}

// Invite users
export interface GQLInviteOrganizationUsersResult {
  inviteUsers: InviteOrganizationUsersSummary;
}

export interface InviteOrganizationUsersSummary {
  numberOfAssignedToRole: number;
  numberOfInvitedAndAssignedToRole: number;
}

export interface GQLInviteOrganizationUsersVariables {
  usersList: { email: string; username?: string }[];
  organizationId: number;
  roleId: number;
}

// Roles input select
export interface GQLGetRolesForInviteOrganizationUsersResult {
  organizationRolesPage: PaginationResponse<InviteUserRole>;
}

export type InviteUserRole = {
  id: string;
  name: string;
};

export interface GQLGetRolesForInviteOrganizationUsersVariables {
  organizationId: number;
  name?: string;
  pageNumber?: number;
  pageSize?: number;
}
