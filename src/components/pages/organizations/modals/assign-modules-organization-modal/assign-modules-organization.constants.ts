import gql from 'graphql-tag';

export const ASSIGN_MODULES_DEFAULT_PAGE_SIZE = 30;

/* GraphQL */
export const GQL_UPDATE_ORGANIZATION_MODULES_MUTATION = gql`
  mutation($modulesList: [Int!]!, $organizationId: Int!) {
    assignModules(organizationId: $organizationId, modulesList: $modulesList)
  }
`;

export const GQL_GET_ORGANIZATION_MODULES_QUERY = gql`
  query($pageNumber: Int, $pageSize: Int, $moduleType: String) {
    modulesPage(pageNumber: $pageNumber, pageSize: $pageSize, moduleType: $moduleType) {
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
