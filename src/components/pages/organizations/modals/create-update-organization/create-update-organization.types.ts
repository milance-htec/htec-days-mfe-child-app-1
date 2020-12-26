import { FormikHelpers } from 'formik';

import {
  OrganizationModalFormValues,
  Organization,
  SetCreateUpdateOrganizationModalStateProps,
} from '../../organizations.types';

import { OnInputChange } from 'common/types';

export interface CreateUpdateOrganizationModalProps {
  modalState: boolean;
  setModalState: (state: boolean, modalOptions?: SetCreateUpdateOrganizationModalStateProps) => () => void;
  modalTitle?: string;
  isOrganizationNameCorrect: boolean;
  isOrganizationNameAvailable: boolean | null;
  onOrganizationNameChange: ((eventChange: any) => OnInputChange) | undefined;
  isOrganizationNameCheckInProgress: boolean;
  selectedOrganization: Organization | null;
  formInitialValues: OrganizationModalFormValues;
  submitForm: (values: OrganizationModalFormValues, formikHelpers: FormikHelpers<OrganizationModalFormValues>) => void;
  organizationModalConfirmButtonText: string;
  organizationQueryParam: string | null;
}
