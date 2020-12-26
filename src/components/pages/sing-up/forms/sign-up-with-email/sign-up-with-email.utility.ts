import { SignUpWithEmailFormValues } from './sign-up-with-email.types';
import { validateEmail, getInputErrorMessage } from 'common/utility';
import { GetInputErrorMessageProps } from 'common/types';
import { FormInputMessage } from 'components/molecules/form-input/form-input.types';
import { FORM_INPUT_MESSAGE_TYPES } from 'components/molecules/form-input/form-input.constants';

export function signUpWithEmailFormValidate({ email, code }: SignUpWithEmailFormValues) {
  const errors: Partial<SignUpWithEmailFormValues> = {};

  // Email
  if (!email) {
    errors.email = 'Email required';
  } else if (!validateEmail(email)) {
    errors.email = 'Email format invalid';
  }

  if (!code) {
    errors.code = 'Code required and is only numbers';
  } else if (code.length < 6) {
    errors.code = 'Code needs to be 6 digits';
  }

  return errors;
}

export function getSignUpWithEmailSubmitButtonDisabledState({
  formInputErrors,
  isRecaptchaValid,
  loadingsInProgress,
  isEmailAvailable,
  isCodeExpired,
  isEmailDomainValid,
}: {
  formInputErrors: Partial<SignUpWithEmailFormValues>;
  isRecaptchaValid: boolean;
  loadingsInProgress: boolean;
  isEmailAvailable: boolean;
  isCodeExpired: boolean;
  isEmailDomainValid: boolean;
}) {
  return (
    (formInputErrors && !!Object.keys(formInputErrors).length) ||
    !isRecaptchaValid ||
    loadingsInProgress ||
    !isEmailAvailable ||
    isCodeExpired ||
    !isEmailDomainValid
  );
}

/* Form input messages */

export function getEmailMessage({
  errorProps,
  isCheckIfEmailExistsInProgress,
  isEmailAvailable,
  isEmailDomainValid,
}: {
  errorProps: GetInputErrorMessageProps;
  isCheckIfEmailExistsInProgress: boolean;
  isEmailAvailable: boolean;
  isEmailDomainValid: boolean;
}): FormInputMessage | undefined {
  if (errorProps.touched && !isCheckIfEmailExistsInProgress) {
    let errorMessage = '';
    let successMessage = '';

    if (errorProps.message) {
      errorMessage = errorProps.message;
    } else if (!isEmailAvailable) {
      errorMessage = 'Email is already taken';
    } else if (!isEmailDomainValid) {
      errorMessage = 'Email domain is not allowed';
    }

    if (isEmailAvailable) {
      successMessage = 'Email is available';
    }

    if (errorMessage) {
      return getInputErrorMessage({
        touched: true,
        message: errorMessage,
      });
    } else if (successMessage) {
      return {
        message: successMessage,
        type: FORM_INPUT_MESSAGE_TYPES.SUCCESS,
      };
    }
  }
}

export function getCodeMessage({
  isSentCodeInvalid,
  errorProps,
  isCodeExpired,
}: {
  isSentCodeInvalid: boolean;
  isCodeExpired: boolean;
  errorProps: GetInputErrorMessageProps;
}): FormInputMessage | undefined {
  if (errorProps.touched) {
    let message = '';

    if (errorProps.message) {
      message = errorProps.message;
    } else if (isSentCodeInvalid) {
      message = 'Invalid code';
    } else if (isCodeExpired) {
      message = 'Code expired. Please send again';
    }

    if (!message) {
      return undefined;
    }

    return getInputErrorMessage({
      touched: true,
      message: message,
    });
  }

  return undefined;
}
