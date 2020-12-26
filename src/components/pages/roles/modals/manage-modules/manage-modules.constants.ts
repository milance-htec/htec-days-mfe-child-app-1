import gql from 'graphql-tag';

export const GQL_SAVE_ROLE_MODULES_MUTATION = gql`
  mutation($roleId: Int!, $organizationId: Int!, $modules: [UpdateOrganizationRoleModule]) {
    updateOrganizationRoleModules(roleId: $roleId, organizationId: $organizationId, modules: $modules)
  }
`;
