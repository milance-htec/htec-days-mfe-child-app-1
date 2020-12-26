import gql from 'graphql-tag';

export const ASSIGN_ROLES_DEFAULT_PAGE_SIZE = 30;

/* GraphQL */
export const GQL_UPDATE_USER_ROLES_MUTATION = gql`
  mutation($rolesList: [Int!]!, $organizationId: Int!, $userId: Int!) {
    assignRoles(organizationId: $organizationId, userId: $userId, rolesList: $rolesList)
  }
`;
