import { FormikTouched } from 'formik';

/* Types */
import { RoleModalFormValues, RoleGetRoleByIdResult } from '../../roles.types';
import { InputWithLabelTypes, InputWithLabelConstants } from 'components/molecules/inputWithLabel';

export function getRoleModalConfirmButtonDisabledState(props: {
  isRoleNameAvailable: boolean;
  isRoleNameCheckInProgress: boolean;
  isRoleNameCorrect: boolean;
  isSubmitting: boolean;
  isTouched: FormikTouched<RoleModalFormValues>;
  isValid: boolean;
  roleQueryParam: string | null;
  values: RoleModalFormValues;
}) {
  const {
    isRoleNameAvailable,
    isRoleNameCheckInProgress,
    isRoleNameCorrect,
    isSubmitting,
    isValid,
    roleQueryParam,
  } = props;

  if (!roleQueryParam) {
    // Disabled state if create role is active
    return !isRoleNameAvailable || !isRoleNameCorrect || !isValid || isRoleNameCheckInProgress || isSubmitting;
  } else {
    // Disabled state if edit role is active
    return isRoleNameCheckInProgress || !isValid || isSubmitting || !isRoleNameCorrect || !isRoleNameAvailable;
  }
}

/* Create role form validation */
export function validateCreateRoleModalForm(values: RoleModalFormValues) {
  const errors: RoleModalFormValues = {};

  if (!values.name) {
    errors.name = 'Role name is required';
  } else if (values.name && values.name.length > 50) {
    errors.name = 'Role name must be under 50 characters';
  }

  if (values.description && values.description.length > 200) {
    errors.description = 'Description must be under 200 characters';
  }

  return errors;
}

/* Field validation messages */
export function getRoleNameFieldUnderMessage(props: {
  isRoleNameFormatCorrect: boolean;
  isTouched: boolean | undefined;
  roleErrorMessage: string | undefined;
  roleName: string | undefined;
  roleNameAvailable: boolean | null;
  selectedRole: RoleGetRoleByIdResult | null;
}): InputWithLabelTypes.InputWithLabelFieldMessage | undefined {
  const { isTouched, roleNameAvailable, roleErrorMessage, isRoleNameFormatCorrect, roleName, selectedRole } = props;

  let message;

  if (isTouched) {
    if (roleErrorMessage) {
      message = {
        message: roleErrorMessage,
        type: InputWithLabelConstants.INPUT_WITH_LABEL_MESSAGE_TYPES.ERROR,
      };
    } else if (!isRoleNameFormatCorrect) {
      message = {
        message: 'A-Z, 1-9, space character. Space-only name not allowed',
        type: InputWithLabelConstants.INPUT_WITH_LABEL_MESSAGE_TYPES.ERROR,
      };
    } else if (roleNameAvailable === false) {
      message = {
        message: 'This role name is already taken',
        type: InputWithLabelConstants.INPUT_WITH_LABEL_MESSAGE_TYPES.ERROR,
      };
    } else if (roleNameAvailable === true && ((selectedRole && roleName !== selectedRole.name) || !selectedRole)) {
      message = {
        message: 'Role name available',
        type: InputWithLabelConstants.INPUT_WITH_LABEL_MESSAGE_TYPES.SUCCESS,
      };
    }
  }

  return message;
}

export function getDescriptionFieldUnderMessage(props: {
  isTouched: boolean | undefined;
  descriptionErrorMessage: string | undefined;
}): InputWithLabelTypes.InputWithLabelFieldMessage | undefined {
  const { isTouched, descriptionErrorMessage } = props;

  let message;

  if (isTouched) {
    if (descriptionErrorMessage) {
      message = {
        message: descriptionErrorMessage,
        type: InputWithLabelConstants.INPUT_WITH_LABEL_MESSAGE_TYPES.ERROR,
      };
    }
  }

  return message;
}
