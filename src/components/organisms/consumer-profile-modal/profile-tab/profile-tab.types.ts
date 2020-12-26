import { Consumer } from 'components/pages/consumers/consumers.types';

export type ProfileTabProps = {
  consumer: Consumer | null;
  onConsumerUpdated: () => void;
};

export type UserInformationFormValues = {
  firstName: string;
  lastName: string;
};

export type ContactInformationFormValues = {
  email: string;
  phoneNumber: string;
};

/* GraphQL */
export type GQLUpdateConsumerResult = {
  updateConsumerUser: boolean | null;
};

export type GQLUpdateConsumerVariables = {
  userId: number;
  userInformation?: UserInformationFormValues;
  contactInformation?: ContactInformationFormValues;
};
