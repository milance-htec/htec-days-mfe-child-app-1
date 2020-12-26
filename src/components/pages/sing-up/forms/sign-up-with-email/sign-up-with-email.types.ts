import { PaginationResponse } from 'common/types';
import { Organization } from 'components/pages/organizations/organizations.types';
export type SignUpWithEmailFormProps = {
  onSignUpSuccess: () => void;
};

export type SignUpWithEmailFormValues = {
  email: string;
  code: string;
};

/* GraphQL */

// Check if email exists
export type GQLCheckIfEmailExistsResult = {
  consumerUserEmailExists: boolean | null;
};

export type GQLCheckIfEmailExistsVariables = {
  email: string;
};

// Send code for email
export type GQLSendCodeForEmailResult = {
  passwordlessConsumerUserSignUp: {
    session: string;
  } | null;
};

export type GQLSendCodeForEmailVariables = {
  email: string;
};

// Submit sign up with email GQL_SUBMIT_SIGN_UP_WITH_EMAIL_MUTATION
export type GQLSubmitSignUpWithEmailResult = {
  confirmPasswordlessConsumerUserSignUp: {
    successfulAuthentication: boolean;
    authenticationResponse: {
      accessToken: string;
    };
    session: string;
  } | null;
};

export type GQLSubmitSignUpWithEmailVariables = {
  email: string;
  code: string;
  session: string;
};

/* GQL */
export interface GQLGetUserOrganizationsResult {
  userOrganizations: PaginationResponse<Organization>;
}

export interface GQLGetUserOrganizationsVariables {
  name?: string;
  pageNumber?: number;
  pageSize?: number;
}
