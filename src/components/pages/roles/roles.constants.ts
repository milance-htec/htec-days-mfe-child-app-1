import gql from 'graphql-tag';
import { RolesPageViewQueryParam } from './roles.types';

export const CREATE_ROLE_MODAL_FORM_INITIAL_VALUES = {
  name: '',
  description: '',
};

export const MAX_DESC_LENGTH = 30;

export const ROLES_LIST_PAGINATION_DEFAULT_PAGE = 0;
export const ROLES_LIST_PAGINATION_DEFAULT_SIZE = 20;
export const ROLES_LIST_DEFAULT_SEARCH = '';
export const ROLES_SEARCH_INPUT_MAX_LIMIT = 50;

export const SEARCH_ROLES_INPUT_TIMEOUT_TIME = 500;
export const CHECK_ROLE_NAME_AVAILABILITY_TIMOUT_TIME = 400;

export const ROLES_PAGE_VIEW_VALUES = {
  TILES: 'tiles' as RolesPageViewQueryParam,
  LIST: 'list' as RolesPageViewQueryParam,
};

export const ROLES_PAGE_QUERY_PARAMS_KEYS = {
  ROLE: 'role',
  PAGE: 'page',
  SIZE: 'size',
  SEARCH: 'search',
  MANAGE_ROLE_MODULES: 'manageRoleModules',
  VIEW: 'view',
};

export const ROLES_PAGE_QUERY_PARAMS_DEFAULTS = {
  PAGE: ROLES_LIST_PAGINATION_DEFAULT_PAGE.toString(),
  SIZE: ROLES_LIST_PAGINATION_DEFAULT_SIZE.toString(),
  SEARCH: ROLES_LIST_DEFAULT_SEARCH,
  VIEW: ROLES_PAGE_VIEW_VALUES.TILES,
};

export const ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL = {
  PAGE: {
    value: ROLES_PAGE_QUERY_PARAMS_DEFAULTS.PAGE,
    name: ROLES_PAGE_QUERY_PARAMS_KEYS.PAGE,
  },
  SIZE: {
    value: ROLES_PAGE_QUERY_PARAMS_DEFAULTS.SIZE,
    name: ROLES_PAGE_QUERY_PARAMS_KEYS.SIZE,
  },
  SEARCH: {
    value: ROLES_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH,
    name: ROLES_PAGE_QUERY_PARAMS_KEYS.SEARCH,
  },
  VIEW: {
    value: ROLES_PAGE_QUERY_PARAMS_DEFAULTS.VIEW,
    name: ROLES_PAGE_QUERY_PARAMS_KEYS.VIEW,
  },
};

export const ROLE_MODAL_TITLES = {
  CREATE_NEW_ROLE: 'Create New Role',
  EDIT_ROLE: 'Edit Role',
};

export const ROLE_MODAL_BUTTON_TITLES = {
  CREATE: 'Create',
  EDIT: 'Edit',
  REMOVE: 'Remove',
  YES: 'Yes, please',
};

export const PAGINATION_DEFAULT_PAGE_SIZE = 20;

export const MODULE_PERMISION_LEVEL_VALUES = {
  NO_ACCESS: 'NO_ACCESS',
  VIEWER: 'VIEWER',
  OWNER: 'OWNER',
};

/* GraphQL */

// Get roles list
export const GQL_GET_ROLES_LIST_QUERY = gql`
  query($organizationId: ID!, $name: String, $pageNumber: Int, $pageSize: Int) {
    organizationRolesPage(organizationId: $organizationId, name: $name, pageNumber: $pageNumber, pageSize: $pageSize) {
      content {
        id
        name
        description
        numberOfAssignedUsers
        numberOfAssignedModules
      }
      totalPages
      totalItems
    }
  }
`;

// Check role name availability
export const GQL_CHECK_ROLE_NAME_AVAILABILITY_QUERY = gql`
  query($organizationId: Int!, $name: String!) {
    findOrganizationRoleName(organizationId: $organizationId, name: $name) {
      name
    }
  }
`;

// Create role
export const GQL_CREATE_ROLE_MUTATION = gql`
  mutation($organizationId: Int!, $name: String!, $description: String) {
    addOrganizationRole(organizationId: $organizationId, name: $name, description: $description) {
      id
      name
    }
  }
`;

// Get role by id
export const GQL_GET_ROLE_BY_ID_QUERY = gql`
  query($organizationId: Int!, $roleId: Int!) {
    findOrganizationRoleById(organizationId: $organizationId, roleId: $roleId) {
      id
      name
      description
    }
  }
`;

// Edit role by id
export const GQL_EDIT_ROLE_MUTATION = gql`
  mutation($organizationId: Int!, $roleId: Int!, $name: String!, $description: String) {
    updateOrganizationRole(organizationId: $organizationId, roleId: $roleId, name: $name, description: $description) {
      id
    }
  }
`;

// Get role modules
export const GQL_GET_ROLE_MODULES_QUERY = gql`
  query($organizationId: ID!, $roleId: ID!) {
    findOrganizationRoleModules(organizationId: $organizationId, roleId: $roleId) {
      id
      name
      description
      modules {
        id
        name
        numberOfAssignedModules
        numberOfModules
        permissionLevel
        subModules {
          id
          name
          numberOfAssignedModules
          numberOfModules
          permissionLevel
          subModules {
            id
            name
            numberOfAssignedModules
            numberOfModules
            permissionLevel
          }
        }
      }
    }
  }
`;

// Get organization modules
export const GQL_GET_ORGANIZATION_MODULES_QUERY = gql`
  query($organizationId: ID!, $pageNumber: Int, $pageSize: Int) {
    organizationModules(organizationId: $organizationId, pageNumber: $pageNumber, pageSize: $pageSize) {
      content {
        id
        name
        subModules {
          id
          name
        }
      }
      totalPages
      totalItems
    }
  }
`;
