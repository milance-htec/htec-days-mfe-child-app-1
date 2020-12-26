import { UserStatus, UserModulePermission, UserOrderBy, ConsumerStatus } from './types';
import { UserModule } from '@reef-tech/reef-cloud-auth';

export const CACHE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  ORGANIZATION_ID: 'organizationId',
};

const HIGH_LEVEL_ROUTE_PREFIX = '/identity-access';

export const ROUTES = {
  HOME: `${HIGH_LEVEL_ROUTE_PREFIX}/home`,
  LOGIN_INVITATION: `${HIGH_LEVEL_ROUTE_PREFIX}/login/invitation`,
  LOGIN: `${HIGH_LEVEL_ROUTE_PREFIX}/login`,
  ORGANIZATION_USERS: `${HIGH_LEVEL_ROUTE_PREFIX}/organization/users`,
  CONSUMERS: `${HIGH_LEVEL_ROUTE_PREFIX}/consumers`,
  ORGANIZATIONS: `${HIGH_LEVEL_ROUTE_PREFIX}/organizations`,
  ROLES: `${HIGH_LEVEL_ROUTE_PREFIX}/roles`,
  SIGNUP: `${HIGH_LEVEL_ROUTE_PREFIX}/signup`,
  WELCOME_CONSUMER: `${HIGH_LEVEL_ROUTE_PREFIX}/welcome-consumer`,
  IDENTITY_ACCESS_WILDCARD: `${HIGH_LEVEL_ROUTE_PREFIX}/`,
  WILDCARD: '/',
};

export const PAGINATION_DEFAULT = 30;

/**
 * Default page for pagination is 0 as in first page (defined by backend)
 */
export const PAGINATION_DEFAULT_PAGE = 0;

// Months constants
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/* Users & Consumer status */
export const USER_STATUSES: { [K in UserStatus]: K } = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INVITED: 'INVITED',
};

export const CONSUMER_STATUSES: { [K in ConsumerStatus]: K } = {
  ACTIVE: 'ACTIVE',
  PENDING_SIGN_UP: 'PENDING_SIGN_UP',
  SUSPENDED: 'SUSPENDED',
};

export enum USER_STATUS_COLOR {
  ACTIVE = 'light-green',
  SUSPENDED = 'transparent-grey',
  INVITED = 'darker-grey',
  UNDEFINED = 'light-grey',
}

export enum CONSUMER_STATUS_COLOR {
  UNDEFINED = 'light-grey',
  PENDING_SIGN_UP = 'darker-grey',
  ACTIVE = 'light-green',
  SUSPENDED = 'transparent-grey',
}

/* Users Order By */
export const USER_ORDER_BY: { [K in UserOrderBy]: K } = {
  ROLES_ASC: 'ROLES_ASC',
  ROLES_DESC: 'ROLES_DESC',
  STATUS_ASC: 'STATUS_ASC',
  STATUS_DESC: 'STATUS_DESC',
  DATE_MODIFIED_ASC: 'DATE_MODIFIED_ASC',
  DATE_MODIFIED_DESC: 'DATE_MODIFIED_DESC',
};

/* Module names */
export const MODULE_NAMES = {
  ROLES: 'Roles',
  ORGANIZATIONS: 'Organizations',
  USERS: 'Users',
  CONSUMERS: 'Consumers',
};

export const USER_MODULE_PERIMISSION: { [K in UserModulePermission]: UserModulePermission } = {
  OWNER: 'OWNER',
  VIEWER: 'VIEWER',
};

/* HTTP error codes */
export const GRAPHQL_ERROR_CODES = {
  BAD_CREDENTIALS: 'bad.credentials',
  NEW_PASSWORD_MUST_BE_DIFFERENT_FROM_CURRENT: 'new.password.must.be.different.from.current',
};

/* RegExp */
export const IS_SPACE_NOT_ONLY_PRESENT_REG_EXP = /\S/;
export const IS_ONLY_ALPHANUMERIC_AND_SPACE_REG_EXP = /^[A-Za-z0-9 ]+$/;

// Regexp for checking if password has lowercase and uppercase letter, at least one number and special character
export const PASSWORD_STRENGTH_REG_EXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;

/* Container relation urls */
export const RC_REDIRECT_URL = `${window.location.origin}/login-callback`;
export const RC_LOGIN_URL = process.env.REACT_APP_LOGIN_URL;
export const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL;

/* Page names */
export const PAGE_NAMES = {
  HOME: 'Home',
  ORGANIZATIONS: 'Organizations',
  ROLES: 'Roles',
  USERS: 'Users',
  CONSUMERS: 'Consumers',
};

/* Required modules */
export const ROLES_PAGE_USER_MODULE_OWNER: UserModule = {
  moduleName: MODULE_NAMES.ROLES,
  permission: USER_MODULE_PERIMISSION.OWNER,
};

export const ROLES_PAGE_USER_MODULE_VIEWER: UserModule = {
  moduleName: MODULE_NAMES.ROLES,
  permission: USER_MODULE_PERIMISSION.VIEWER,
};

export const ORGANIZATION_USERS_PAGE_USER_MODULE_OWNER: UserModule = {
  moduleName: MODULE_NAMES.USERS,
  permission: USER_MODULE_PERIMISSION.OWNER,
};

export const ORGANIZATION_USERS_PAGE_USER_MODULE_VIEWER: UserModule = {
  moduleName: MODULE_NAMES.USERS,
  permission: USER_MODULE_PERIMISSION.VIEWER,
};

export const ORGANIZATIONS_PAGE_USER_MODULE_OWNER: UserModule = {
  moduleName: MODULE_NAMES.ORGANIZATIONS,
  permission: USER_MODULE_PERIMISSION.OWNER,
};

export const ORGANIZATIONS_PAGE_USER_MODULE_VIEWER: UserModule = {
  moduleName: MODULE_NAMES.ORGANIZATIONS,
  permission: USER_MODULE_PERIMISSION.VIEWER,
};

export const CONSUMERS_USER_MODULE_OWNER: UserModule = {
  moduleName: MODULE_NAMES.CONSUMERS,
  permission: USER_MODULE_PERIMISSION.OWNER,
};

export const CONSUMERS_USER_MODULE_VIEWER: UserModule = {
  moduleName: MODULE_NAMES.CONSUMERS,
  permission: USER_MODULE_PERIMISSION.VIEWER,
};

export const INPUT_KEYBOARD_KEYS = {
  ENTER: 'Enter',
  TAB: 'Tab',
  SPACE: ' ',
};
