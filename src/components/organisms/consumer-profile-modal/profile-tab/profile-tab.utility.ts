/* Types */
import { UserInformationFormValues, ContactInformationFormValues } from './profile-tab.types';

/* Constants */
import {
  PROFILE_TAB_FIRST_NAME_LIMIT,
  PROFILE_TAB_LAST_NAME_LIMIT,
  PROFILE_TAB_PHONE_NUMBER_LIMIT,
} from './profile-tab.constants';
import { IS_ONLY_ALPHANUMERIC_AND_SPACE_REG_EXP, IS_SPACE_NOT_ONLY_PRESENT_REG_EXP } from 'common/constants';

/* Utilities */
import { validateEmail, validatePhoneNumber } from 'common/utility';

export const validateUserInformationForm = (setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>) => ({
  firstName,
  lastName,
}: UserInformationFormValues) => {
  const errors: Partial<UserInformationFormValues> = {};

  // First name
  if (firstName?.length > PROFILE_TAB_FIRST_NAME_LIMIT) {
    errors.firstName = `Character limit is ${PROFILE_TAB_FIRST_NAME_LIMIT}`;
  } else if (firstName && !IS_ONLY_ALPHANUMERIC_AND_SPACE_REG_EXP.test(firstName)) {
    errors.firstName = 'Only alphanumeric and space characters allowed';
  } else if (firstName && !IS_SPACE_NOT_ONLY_PRESENT_REG_EXP.test(firstName)) {
    errors.firstName = 'Alphanumeric characters required';
  }

  // Last name
  if (lastName?.length > PROFILE_TAB_LAST_NAME_LIMIT) {
    errors.lastName = `Character limit is ${PROFILE_TAB_LAST_NAME_LIMIT}`;
  } else if (lastName && !IS_ONLY_ALPHANUMERIC_AND_SPACE_REG_EXP.test(lastName)) {
    errors.lastName = 'Only alphanumeric and space characters allowed';
  } else if (lastName && !IS_SPACE_NOT_ONLY_PRESENT_REG_EXP.test(lastName)) {
    errors.lastName = 'Alphanumeric characters required';
  }

  if (Object.keys(errors).length) {
    setIsFormValid(false);
  } else {
    setIsFormValid(true);
  }

  return errors;
};

export const validateContactInformationForm = (setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>) => ({
  email,
  phoneNumber,
}: ContactInformationFormValues) => {
  const errors: Partial<ContactInformationFormValues> = {};
  // Email
  if (!email && !phoneNumber) {
    errors.email = 'Email is required';
  } else if (email && !validateEmail(email)) {
    errors.email = 'Email invalid format';
  }

  // Phone number
  if (!phoneNumber && !email) {
    errors.phoneNumber = 'Mobile phone number is required';
  } else if (phoneNumber && phoneNumber.length > PROFILE_TAB_PHONE_NUMBER_LIMIT) {
    errors.phoneNumber = `Mobile phone number limit is ${PROFILE_TAB_PHONE_NUMBER_LIMIT}`;
  } else if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
    errors.phoneNumber = 'Mobile phone number invalid format';
  }

  if (Object.keys(errors).length) {
    setIsFormValid(false);
  } else {
    setIsFormValid(true);
  }

  return errors;
};
