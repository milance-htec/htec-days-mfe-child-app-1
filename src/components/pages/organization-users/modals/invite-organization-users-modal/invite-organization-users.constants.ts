import gql from 'graphql-tag';

export const EMAIL_CARDS_INPUT_ELEMENTS_LIMIT = 25;
export const GET_ROLES_TIMEOUT_DEBOUNCE = 400;
export const ROLES_PAGE_SIZE_DEFAULT = 7;
export const ROLES_PAGE_NUMBER_DEFAULT = 5;

/* GraphQL */
export const GQL_FIND_ORGANIZATION_USER_BY_EMAIL_QUERY = gql`
  query($organizationId: Int!, $email: String!) {
    findOrganizationUserByEmail(organizationId: $organizationId, email: $email) {
      email
      fullName
      username
      userStatus
    }
  }
`;

export const GQL_GET_ROLES_FOR_INVITE_ORGANIZATION_USERS_QUERY = gql`
  query($organizationId: ID!, $name: String, $pageNumber: Int, $pageSize: Int) {
    organizationRolesPage(organizationId: $organizationId, name: $name, pageNumber: $pageNumber, pageSize: $pageSize) {
      content {
        id
        name
      }
      totalPages
      totalItems
    }
  }
`;

export const GQL_INVITE_ORGANIZATION_USERS_MUTATION = gql`
  mutation($usersList: [InviteUser!]!, $organizationId: Int!, $roleId: Int!) {
    inviteUsers(usersList: $usersList, organizationId: $organizationId, roleId: $roleId) {
      numberOfAssignedToRole
      numberOfInvitedAndAssignedToRole
    }
  }
`;
