import gql from 'graphql-tag';
import { ConsumerProfileModalTabListItem, ConsumerProfileModalTabsListKeys } from './consumer-profile-modal.types';

export const USER_PROFILE_MODAL_TABS_LIST_KEYS = {
  PROFILE: 'profile' as ConsumerProfileModalTabsListKeys,
  SECURITY: 'security' as ConsumerProfileModalTabsListKeys,
};

export const USER_PROFILE_MODAL_TABS_LIST: ConsumerProfileModalTabListItem[] = [
  {
    title: 'Profile',
    key: 'profile',
  },
];

/* GraphQL */
export const GQL_GET_CONSUMER_DATA_QUERY = gql`
  query($consumerId: Int!) {
    consumerUserDataById(id: $consumerId) {
      id
      consumerId
      username
      isSsoUser
      givenName
      familyName
      fullName
      email
      temporaryEmail
      phoneNumber
      temporaryPhoneNumber
      userStatus
      lastModifiedDate
    }
  }
`;
