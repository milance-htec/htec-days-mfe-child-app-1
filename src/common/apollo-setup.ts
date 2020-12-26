import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { getAccessToken } from '@reef-tech/reef-cloud-auth';

const httpLink = {
  default: new HttpLink({
    uri: `${process.env.REACT_APP_GRAPHQL_URL}`,
  }),
  open: new HttpLink({
    uri: `${process.env.REACT_APP_GRAPHQL_URL}/open`,
  }),
};

export const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = getAccessToken();

  const isOpen = operation.getContext().isOpen;
  const tempAccessToken = operation.getContext().tempAccessToken;

  if (!isOpen) {
    if (tempAccessToken) {
      operation.setContext({
        headers: {
          authorization: tempAccessToken,
        },
      });
    } else if (accessToken) {
      // add the authorization to the headers
      operation.setContext({
        headers: {
          authorization: accessToken,
        },
      });
    }
  }

  // Decide if query is open or closed

  let endpoint: 'default' | 'open' = isOpen ? 'open' : 'default';

  return httpLink[endpoint].request(operation);
});
