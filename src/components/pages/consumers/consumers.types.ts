import { BaseQueryParameters } from 'common/hooks/useQueryParams';
import { PaginationTokenResponse, ConsumerStatus } from 'common/types';

export type Consumer = {
  id: number;
  consumerId: number;
  username: string;
  isSsoUser: boolean;
  givenName: string;
  familyName: string;
  fullName: string;
  email: string;
  temporaryEmail?: string;
  phoneNumber: string;
  temporaryPhoneNumber?: string;
  userStatus: ConsumerStatus;
  lastModifiedDate: string;
};

/* Query params */
export interface ConsumersPageQueryParams extends BaseQueryParameters {
  search: string | null;
  searchType: ConsumersPageSearchTypeQueryParam | null;
  region: ConsumersPageRegionQueryParam | null;
}

export type ConsumersPageSearchTypeQueryParam = 'phone' | 'email';
export type ConsumersPageRegionQueryParam = 'us' | 'ca';

/* GraphQL */

export interface GQLGetConsumerPageResult {
  consumerUsersPage: PaginationTokenResponse<Consumer> | null;
}

export interface GQLGetConsumerPageResultVariables {
  email?: string;
  pageSize?: number;
  paginationToken?: string;
  phoneNumber?: string;
  userPoolKey: ConsumersPageRegionQueryParam;
}
