import gql from 'graphql-tag';
import { OrganizationUsersPageSearchTypeQueryParam } from './organization-users.types';

export const USER_SEARCH_INPUT_MAX_LIMIT = 40;
export const USER_SEARCH_INPUT_MIN_LIMIT = 3;
export const SEARCH_USERS_INPUT_TIMEOUT_TIME = 500;

export const ORGANIZATION_USERS_SEARCH_TYPE_VALUES = {
  NAME: 'name' as OrganizationUsersPageSearchTypeQueryParam,
  EMAIL: 'email' as OrganizationUsersPageSearchTypeQueryParam,
};

export const ORGANIZATION_USERS_LIST_PAGINATION_DEFAULT_SIZE = 20;
export const ORGANIZATION_USERS_LIST_PAGINATION_DEFAULT_PAGE = 0;
export const ORGANIZATION_USERS_LIST_DEFAULT_SEARCH = null;
export const ORGANIZATION_USERS_LIST_DEFAULT_ROLE = null;
export const ORGANIZATION_USERS_LIST_DEFAULT_STATUS = null;
export const ORGANIZATION_USERS_LIST_DEFAULT_ORDER_BY = null;
export const ORGANIZATION_USERS_LIST_DEFAULT_DATE_FROM = null;
export const ORGANIZATION_USERS_LIST_DEFAULT_DATE_TO = null;
export const ORGANIZATION_USERS_LIST_DEFAULT_SEARCH_TYPE = ORGANIZATION_USERS_SEARCH_TYPE_VALUES.EMAIL;

export const ORGANIZATION_ROLES_PAGE_SIZE = 999;

export const ROLES_FILTER_LIMIT_INPUT = 2;
export const STATUSES_FILTER_LIMIT_INPUT = 1;

export const ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS = {
  PAGE: ORGANIZATION_USERS_LIST_PAGINATION_DEFAULT_PAGE.toString(),
  SIZE: ORGANIZATION_USERS_LIST_PAGINATION_DEFAULT_SIZE.toString(),
  SEARCH: ORGANIZATION_USERS_LIST_DEFAULT_SEARCH,
  ROLE: ORGANIZATION_USERS_LIST_DEFAULT_ROLE,
  STATUS: ORGANIZATION_USERS_LIST_DEFAULT_STATUS,
  ORDER_BY: ORGANIZATION_USERS_LIST_DEFAULT_ORDER_BY,
  DATE_FROM: ORGANIZATION_USERS_LIST_DEFAULT_DATE_FROM,
  DATE_TO: ORGANIZATION_USERS_LIST_DEFAULT_DATE_TO,
  SEARCH_TYPE: ORGANIZATION_USERS_LIST_DEFAULT_SEARCH_TYPE,
};

export const ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS = {
  PAGE: 'page',
  SIZE: 'size',
  SEARCH: 'search',
  ROLE: 'role',
  STATUS: 'status',
  ORDER_BY: 'orderBy',
  DATE_FROM: 'dateFrom',
  DATE_TO: 'dateTo',
  SEARCH_TYPE: 'searchType',
};

export const ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL = {
  PAGE: {
    value: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE,
    name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.PAGE,
  },
  SIZE: {
    value: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.SIZE,
    name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.SIZE,
  },
  SEARCH: {
    value: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH,
    name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.SEARCH,
  },
  ROLE: {
    value: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.ROLE,
    name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.ROLE,
  },
  STATUS: {
    value: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.STATUS,
    name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.STATUS,
  },
  ORDER_BY: {
    value: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.ORDER_BY,
    name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.ORDER_BY,
  },
  DATE_FROM: {
    value: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.DATE_FROM,
    name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.DATE_FROM,
  },
  DATE_TO: {
    value: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.DATE_TO,
    name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.DATE_TO,
  },
  SEARCH_TYPE: {
    value: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH_TYPE,
    name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.SEARCH_TYPE,
  },
};

export const SEARCH_TYPE_DROPDOWN_OPTIONS = [
  {
    name: 'Name',
    value: ORGANIZATION_USERS_SEARCH_TYPE_VALUES.NAME,
  },
  {
    name: 'Email',
    value: ORGANIZATION_USERS_SEARCH_TYPE_VALUES.EMAIL,
  },
];

/* GraphQL */
export const GET_ORGANIZATION_USERS_QUERY = gql`
  query(
    $organizationId: ID!
    $email: String
    $roleIds: [Int]
    $statuses: [UserStatus]
    $dateFrom: String
    $dateTo: String
    $orderBy: [OrderBy]
    $pageNumber: Int
    $pageSize: Int
    $name: String
  ) {
    organizationUsersPage(
      organizationId: $organizationId
      email: $email
      roleIds: $roleIds
      statuses: $statuses
      dateFrom: $dateFrom
      dateTo: $dateTo
      orderBy: $orderBy
      pageNumber: $pageNumber
      pageSize: $pageSize
      name: $name
    ) {
      content {
        id
        username
        givenName
        familyName
        fullName
        email
        userStatus
        invitedOnDate
        acceptedOnDate
        username
        profilePictureUrl
        roles {
          id
          name
        }
      }
      totalPages
      totalItems
    }
  }
`;

export const GQL_GET_USER_DATA_ACCESS_QUERY = gql`
  query($organizationId: ID!, $userId: ID!, $pageNumber: Int, $pageSize: Int) {
    organizationUserLocationsPage(
      organizationId: $organizationId
      userId: $userId
      pageNumber: $pageNumber
      pageSize: $pageSize
    ) {
      content {
        name
      }
      totalItems
    }
  }
`;

export const GQL_GET_USER_STATUSES_QUERY = gql`
  query userStatuses {
    userStatuses {
      statuses
    }
  }
`;

export const GQL_RESEND_USER_INVITATION_MUTATION = gql`
  mutation($organizationId: Int!, $userId: Int!) {
    resendInvitation(organizationId: $organizationId, userId: $userId)
  }
`;

export const GQL_UPDATE_STATUS_MUTATION = gql`
  mutation($organizationId: Int!, $userId: Int!, $userStatus: UserStatus) {
    updateUserStatus(organizationId: $organizationId, userId: $userId, userStatus: $userStatus)
  }
`;
