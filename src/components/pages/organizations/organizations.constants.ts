import gql from 'graphql-tag';

export const ORGANIZATION_MODAL_TITLES = {
  CREATE_NEW_ORGANIZATION: 'Create New Organization',
  EDIT_ORGANIZATION: 'Edit Organization',
};

export const CREATE_ORGANIZATION_MODAL_FORM_INITIAL_VALUES = {
  name: '',
  description: '',
};

export const ORGANIZATIONS_LIST_PAGINATION_DEFAULT_PAGE = 0;
export const ORGANIZATIONS_LIST_PAGINATION_DEFAULT_SIZE = 20;
export const ORGANIZATIONS_LIST_DEFAULT_SEARCH = '';
export const ORGANIZATIONS_SEARCH_INPUT_MAX_LIMIT = 40;

export const ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS = {
  PAGE: ORGANIZATIONS_LIST_PAGINATION_DEFAULT_PAGE.toString(),
  SIZE: ORGANIZATIONS_LIST_PAGINATION_DEFAULT_SIZE.toString(),
  SEARCH: ORGANIZATIONS_LIST_DEFAULT_SEARCH,
};

export const ORGANIZATIONS_LIST_PAGINATION_DEFAULT_PAGE_SIZE = 20;

export const SEARCH_ORGANIZATIONS_INPUT_TIMEOUT_TIME = 500;
export const CHECK_ORGANIZATION_NAME_AVAILABILITY_TIMOUT_TIME = 400;

export const ORGANIZATION_MODAL_BUTTON_TITLES = {
  CREATE: 'Create',
  EDIT: 'Edit',
  REMOVE: 'Remove',
  YES: 'Yes, please',
};

export const ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS = {
  PAGE: 'page',
  SIZE: 'size',
  SEARCH: 'search',
  ORGANIZATION: 'organization',
};

export const ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL = {
  PAGE: {
    value: ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE,
    name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.PAGE,
  },
  SIZE: {
    value: ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.SIZE,
    name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.SIZE,
  },
  SEARCH: {
    value: ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH,
    name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.SEARCH,
  },
};

/* GraphQL */
export const GQL_GET_ORGANIZATIONS_QUERY = gql`
  query($name: String, $pageNumber: Int, $pageSize: Int) {
    findAllOrganizations(name: $name, pageNumber: $pageNumber, pageSize: $pageSize) {
      content {
        id
        name
        description
        logoUrl
        type
        modules {
          id
          name
        }
      }
      totalPages
      totalItems
    }
  }
`;

export const GQL_CHECK_ORGANIZATION_NAME_QUERY = gql`
  query($name: String!) {
    findOrganizationName(name: $name) {
      name
    }
  }
`;

export const GQL_CREATE_NEW_ORGANIZATION_MUTATION = gql`
  mutation($name: String!, $description: String) {
    addOrganization(name: $name, description: $description) {
      id
    }
  }
`;

export const GQL_FIND_ORGANIZATION_BY_ID = gql`
  query($id: Int!) {
    findOrganizationById(id: $id) {
      id
      name
      description
      status
      logoUrl
      type
      modules {
        id
        name
      }
    }
  }
`;

export const GQL_UPDATE_ORGANIZATION = gql`
  mutation($id: ID!, $name: String!, $description: String!) {
    updateOrganization(id: $id, name: $name, description: $description)
  }
`;
