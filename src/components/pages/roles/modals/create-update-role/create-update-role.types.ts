import { FormikHelpers } from 'formik';

import { RoleGetRoleByIdResult, RoleModalFormValues, SetCreateUpdateRoleModalStateProps } from '../../roles.types';

import { OnInputChange } from 'common/types';

export interface CreateUpdateRoleModalProps {
  modalState: boolean;
  modalTitle: string;
  roleQueryParam: string | null;
  formInitialValues: RoleModalFormValues;
  submitForm: (values: RoleModalFormValues, formikHelpers: FormikHelpers<RoleModalFormValues>) => void;
  onRoleNameChange: ((eventChange: any) => OnInputChange) | undefined;
  isRoleNameAvailable: boolean | null;
  isRoleNameCorrect: boolean;
  setModalState: (state: boolean, modalOptions?: SetCreateUpdateRoleModalStateProps) => () => void;
  isRoleNameCheckInProgress: boolean;
  roleModalConfirmButtonText: string;
  selectedRole: RoleGetRoleByIdResult | null;
}
