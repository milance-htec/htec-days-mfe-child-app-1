import gql from 'graphql-tag';

import { SignUpWithEmailFormValues } from './sign-up-with-email.types';

export const SIGN_UP_WITH_EMAIL_FORM_INITIAL_VALUES: SignUpWithEmailFormValues = {
  email: '',
  code: '',
};

export const CHECK_IF_EMAIL_EXISTS_DEBOUNCE_TIMEOUT = 700;

/* GraphQL */
export const GQL_CHECK_IF_EMAIL_EXISTS_QUERY = gql`
  query($email: String!) {
    consumerUserEmailExists(email: $email)
  }
`;

export const GQL_SEND_CODE_FOR_EMAIL_MUTATION = gql`
  mutation($email: String!) {
    passwordlessConsumerUserSignUp(email: $email) {
      session
    }
  }
`;

export const GQL_SUBMIT_SIGN_UP_WITH_EMAIL_MUTATION = gql`
  mutation($email: String!, $code: String!, $session: String!) {
    confirmPasswordlessConsumerUserSignUp(email: $email, code: $code, session: $session) {
      successfulAuthentication
      authenticationResponse {
        accessToken
      }
      session
    }
  }
`;

export const GET_USER_ORGANIZATIONS = gql`
  query($name: String, $pageNumber: Int, $pageSize: Int) {
    userOrganizations(name: $name, pageNumber: $pageNumber, pageSize: $pageSize) {
      content {
        id
        name
        description
        status
      }
      totalPages
      totalItems
    }
  }
`;
