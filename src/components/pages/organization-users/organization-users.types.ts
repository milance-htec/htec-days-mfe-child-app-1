import { PaginationResponse, UserStatus } from 'common/types';
import { BaseQueryParameters } from 'common/hooks/useQueryParams';

import { Role } from '../roles/roles.types';

/* Query params */
export interface OrganizationUsersPageQueryParams extends BaseQueryParameters {
  page: string | null;
  size: string | null;
  search: string | null;
  role: string | string[] | null;
  status: string | string[] | null;
  orderBy: string | null;
  dateFrom: string | null;
  dateTo: string | null;
  searchType: OrganizationUsersPageSearchTypeQueryParam | null;
}

export type OrganizationUsersPageSearchTypeQueryParam = 'name' | 'email';

/* Data interfaces and types */
export interface OrganizationUser {
  acceptedOnDate?: string;
  email: string;
  familyName: string;
  fullName: string;
  givenName: string;
  id: string;
  invitedOnDate?: string;
  roles: Role[];
  username: string;
  userStatus: UserStatus;
  profilePictureUrl: string;
}

export type DataAccessDropdownData = {
  locations: UserDataAccessItem[];
  totalItems: number;
};

export type StatusOption = {
  name: string;
};

/* GraphQL types */

// Organization users list
export interface GQLGetOrganizationUsersResult {
  organizationUsersPage: PaginationResponse<OrganizationUser>;
}

export interface GQLGetOrganizationUsersVariables {
  dateFrom?: string;
  dateTo?: string;
  email?: string;
  name?: string;
  orderBy?: string;
  organizationId: string;
  pageNumber?: number;
  pageSize?: number;
  roleIds?: number[];
  statuses?: string[];
}

// Get user data access
export type GQLGetUserDataAccessResult = {
  organizationUserLocationsPage: PaginationResponse<UserDataAccessItem> | null;
};

type UserDataAccessItem = {
  name: string;
};

export type GQLGetUserDataAccessVariables = {
  organizationId: string;
  userId: string;
  pageNumber?: number;
  pageSize?: number;
};

// Get user statuses
export type GQLGetUserStatusesResult = {
  userStatuses: UserStatuses | null;
};

type UserStatuses = {
  statuses: string[];
};

export type GQLGetUserStatusesVariables = {};

// Resent user invitation
export type GQLResendUserInvitationResult = {
  resendInvitation: boolean | undefined;
};

export type GQLResendUserInvitationVariables = {
  userId: number;
  organizationId: number;
};

// Update user status
export type GQLUpdateUserStatusResult = {
  updateUserStatus: boolean | undefined;
};

export type GQLUpdateUserStatusVariables = {
  userId: number;
  organizationId: number;
  userStatus: UserStatus;
};
