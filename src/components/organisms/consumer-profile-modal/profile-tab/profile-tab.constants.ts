import gql from 'graphql-tag';

export const PROFILE_TAB_FIRST_NAME_LIMIT = 50;
export const PROFILE_TAB_LAST_NAME_LIMIT = 50;
export const PROFILE_TAB_PHONE_NUMBER_LIMIT = 50;

export enum PROFILE_TAB_FIELD_NAME {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
}

export enum PROFILE_TAB_ERROR_KEY {
  EMAIL_EXISTS = 'user.with.email.exists',
  PHONE_NUMBER_EXISTS = 'user.with.phone.exists',
}

/* GraphQL */
export const GQL_UPDATE_CONSUMER_MUTATION = gql`
  mutation($userId: Int!, $userInformation: UserInformation, $contactInformation: ContactInformation) {
    updateConsumerUser(userId: $userId, userInformation: $userInformation, contactInformation: $contactInformation)
  }
`;
