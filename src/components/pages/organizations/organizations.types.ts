import { PaginationResponse } from 'common/types';

import { BaseQueryParameters } from 'common/hooks/useQueryParams';

/* Query params */
export interface OrganizationsPageQueryParams extends BaseQueryParameters {
  page: string | null;
  size: string | null;
  search: string | null;
  organization: string | null;
}

/* Data interfaces and types */
export type Organization = {
  id: string;
  name: string;
  description: string;
  status: string;
  logoUrl?: string;
  type?: string;
  modules?: OrganizationModule[];
};

export type OrganizationModule = {
  id: string;
  name: string;
  subModules: OrganizationModule[];
};

export type OrganizationModalFormValues = {
  description?: string;
  name: string;
};

export interface SetCreateUpdateOrganizationModalStateProps {
  callback?: () => void;
  clearParams?: boolean;
  formData?: OrganizationModalFormValues;
}

/* GraphQL types */

// Get organizations
export type GQLGetOrganizationsResult = {
  findAllOrganizations: PaginationResponse<Organization> | null;
};

export type GQLGetOrganizationsVariables = {
  name?: string;
  pageNumber?: number;
  pageSize?: number;
};

// Create organization
export type GQLCreateOrganizationResult = {
  addOrganization: { id: string } | null;
};

export type GQLCreateOrganizationVariables = {
  name: string;
  description?: string;
};

// Check organization name
export type GQLCheckOrganizationNameResult = {
  findOrganizationName: { name: string } | null;
};

export type GQLCheckOrganizationNameVariables = {
  name: string;
};

// Get organization by id
export type GQLGetOrganizationByIdResult = {
  findOrganizationById: Organization | null;
};

export type GQLGetOrganizationByIdVariables = {
  id: number;
};

// Update organization
export type GQLUpdateOrganizationResult = {
  updateOrganization: boolean | null;
};

export type GQLUpdateOrganizationVariables = {
  id: number;
  name: string;
  description: string;
};
