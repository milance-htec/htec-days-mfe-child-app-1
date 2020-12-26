import gql from 'graphql-tag';

/* GraphQL */
export const GQL_DELETE_ROLE_BY_ID_MUTATION = gql`
  mutation($roleId: Int!, $organizationId: Int!) {
    deleteOrganizationRole(roleId: $roleId, organizationId: $organizationId)
  }
`;
