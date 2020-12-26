import gql from 'graphql-tag';

import { ConsumersPageRegionQueryParam, ConsumersPageSearchTypeQueryParam } from './consumers.types';

export const CONSUMERS_SEARCH_INPUT_MAX_LIMIT = 50;
export const CONSUMERS_PAGE_REGION_QUERY_PARAM_VALUES = {
  US: 'us' as ConsumersPageRegionQueryParam,
  CA: 'ca' as ConsumersPageRegionQueryParam,
};
export const CONSUMERS_PAGE_SEARCH_TYPE_QUERY_PARAM_VALUES = {
  PHONE: 'phone' as ConsumersPageSearchTypeQueryParam,
  EMAIL: 'email' as ConsumersPageSearchTypeQueryParam,
};

export const CONSUMERS_PAGE_QUERY_PARAMS_DEFAULTS = {
  SEARCH: null,
  SEARCH_TYPE: CONSUMERS_PAGE_SEARCH_TYPE_QUERY_PARAM_VALUES.PHONE,
  REGION: CONSUMERS_PAGE_REGION_QUERY_PARAM_VALUES.US,
};

export const CONSUMERS_PAGE_QUERY_PARAMS_KEYS = {
  SEARCH: 'search',
  SEARCH_TYPE: 'searchType',
  REGION: 'region',
};

export const CONSUMERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL = {
  SEARCH_TYPE: {
    name: CONSUMERS_PAGE_QUERY_PARAMS_KEYS.SEARCH_TYPE,
    value: CONSUMERS_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH_TYPE,
  },
  REGION: {
    name: CONSUMERS_PAGE_QUERY_PARAMS_KEYS.REGION,
    value: CONSUMERS_PAGE_QUERY_PARAMS_DEFAULTS.REGION,
  },
};

export const CONSUMERS_PAGE_SEARCH_TYPE_DROPDOWN_OPTIONS = [
  {
    name: 'Mobile phone',
    value: CONSUMERS_PAGE_SEARCH_TYPE_QUERY_PARAM_VALUES.PHONE,
  },
  {
    name: 'Email',
    value: CONSUMERS_PAGE_SEARCH_TYPE_QUERY_PARAM_VALUES.EMAIL,
  },
];

export const CONSUMERS_PAGE_REGION_DROPDOWN_OPTIONS = [
  {
    name: 'US',
    value: CONSUMERS_PAGE_REGION_QUERY_PARAM_VALUES.US,
  },
  {
    name: 'Canada',
    value: CONSUMERS_PAGE_REGION_QUERY_PARAM_VALUES.CA,
  },
];

export const CONSUMERS_PAGE_REGION_OPTIONS_PAIRS = {
  [CONSUMERS_PAGE_REGION_QUERY_PARAM_VALUES.US]: '+1',
  [CONSUMERS_PAGE_REGION_QUERY_PARAM_VALUES.CA]: '+1',
};

/* GraphQL */

// Get consumers page data
export const GQL_GET_CONSUMERS_PAGE_QUERY = gql`
  query($pageSize: Int, $paginationToken: String, $userPoolKey: String!, $email: String, $phoneNumber: String) {
    consumerUsersPage(
      pageSize: $pageSize
      paginationToken: $paginationToken
      userPoolKey: $userPoolKey
      email: $email
      phoneNumber: $phoneNumber
    ) {
      content {
        id
        consumerId
        username
        isSsoUser
        givenName
        familyName
        fullName
        email
        temporaryEmail
        phoneNumber
        temporaryPhoneNumber
        userStatus
        lastModifiedDate
      }
      paginationToken
    }
  }
`;
