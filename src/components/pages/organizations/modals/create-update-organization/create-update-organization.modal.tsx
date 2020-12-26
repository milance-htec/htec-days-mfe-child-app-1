import React, { FunctionComponent } from 'react';
import { Formik, Form, FormikTouched } from 'formik';

/* Components */

import { Modal, Heading, ItemHolder, Button } from 'components/atoms';
import { InputWithLabel, Flex } from 'components/molecules';
import { InputWithLabelTypes, InputWithLabelConstants } from 'components/molecules/inputWithLabel';

/* Types */

import { CreateUpdateOrganizationModalProps } from './create-update-organization.types';
import { OrganizationModalFormValues, Organization } from '../../organizations.types';

const CreateUpdateOrganizationModal: FunctionComponent<CreateUpdateOrganizationModalProps> = (props) =>
  props.modalState ? <ModalBody {...props} /> : null;

const ModalBody: FunctionComponent<CreateUpdateOrganizationModalProps> = ({
  setModalState = () => () => {},
  modalState = false,
  modalTitle = '',
  isOrganizationNameCorrect = false,
  isOrganizationNameAvailable = null,
  onOrganizationNameChange,
  isOrganizationNameCheckInProgress = false,
  selectedOrganization,
  formInitialValues,
  organizationModalConfirmButtonText = '',
  organizationQueryParam,
  submitForm,
}) => (
  <Modal
    showModal={modalState}
    heading={modalTitle}
    onModalBlur={setModalState(false, {
      clearParams: organizationQueryParam ? true : false,
    })}
    closeButtonIconDisabled={isOrganizationNameCheckInProgress}
  >
    <Formik
      initialValues={formInitialValues}
      onSubmit={submitForm}
      validate={validateCreateOrganizationModalForm}
      initialErrors={{}}
    >
      {({ values, errors, isValid, touched, handleChange, setFieldTouched, handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit} noValidate autoComplete="off">
          <Heading type={3} style={{ marginBottom: '0px', color: '#000000' }}>
            Organization name
          </Heading>
          <InputWithLabel
            name="name"
            onChange={onOrganizationNameChange && onOrganizationNameChange(handleChange)}
            onTouched={setFieldTouched}
            placeholder="Enter organization name*"
            type="text"
            value={values.name}
            message={getOrganizationNameFieldUnderMessage({
              isOrganizationNameFormatCorrect: isOrganizationNameCorrect,
              isTouched: touched.name,
              organizationErrorMessage: errors.name,
              organizationNameAvailable: isOrganizationNameAvailable,
              organizationName: values.name,
              selectedOrganization,
            })}
          />

          {/* Description input */}
          <Heading type={3} style={{ marginBottom: '0px', color: '#000000' }}>
            Description
          </Heading>
          <InputWithLabel
            name="description"
            onChange={handleChange}
            onTouched={setFieldTouched}
            placeholder="Add some description here"
            type="text"
            value={values.description}
            message={getDescriptionFieldUnderMessage({
              descriptionErrorMessage: errors.description,
              isTouched: touched.description,
            })}
          />

          <Flex.Layout justifyContent="flex-end">
            <ItemHolder leftSpacing>
              <Button
                id="organizations-page-create-update-modal-create-edit-button"
                type="submit"
                disabled={getOrganizationModalConfirmButtonDisabledState({
                  isOrganizationNameAvailable: !!isOrganizationNameAvailable,
                  isOrganizationNameCheckInProgress: isOrganizationNameCheckInProgress,
                  isOrganizationNameCorrect,
                  isSubmitting,
                  isTouched: touched,
                  isValid,
                  organizationQueryParam,
                  values,
                })}
              >
                {organizationModalConfirmButtonText}
              </Button>
            </ItemHolder>
          </Flex.Layout>
        </Form>
      )}
    </Formik>
  </Modal>
);

const getOrganizationNameFieldUnderMessage = (props: {
  isOrganizationNameFormatCorrect: boolean;
  isTouched: boolean | undefined;
  organizationErrorMessage: string | undefined;
  organizationName: string | undefined;
  organizationNameAvailable: boolean | null;
  selectedOrganization: Organization | null;
}): InputWithLabelTypes.InputWithLabelFieldMessage | undefined => {
  const {
    isTouched,
    organizationNameAvailable,
    organizationErrorMessage,
    isOrganizationNameFormatCorrect,
    organizationName,
    selectedOrganization,
  } = props;

  let message;

  if (isTouched) {
    if (organizationErrorMessage) {
      message = {
        message: organizationErrorMessage,
        type: InputWithLabelConstants.INPUT_WITH_LABEL_MESSAGE_TYPES.ERROR,
      };
    } else if (!isOrganizationNameFormatCorrect) {
      message = {
        message: 'A-Z, 1-9, space character. Space-only name not allowed',
        type: InputWithLabelConstants.INPUT_WITH_LABEL_MESSAGE_TYPES.ERROR,
      };
    } else if (organizationNameAvailable === false) {
      message = {
        message: 'This organization name is already taken',
        type: InputWithLabelConstants.INPUT_WITH_LABEL_MESSAGE_TYPES.ERROR,
      };
    } else if (
      organizationNameAvailable === true &&
      ((selectedOrganization && organizationName !== selectedOrganization.name) || !selectedOrganization)
    ) {
      message = {
        message: 'Organization name available',
        type: InputWithLabelConstants.INPUT_WITH_LABEL_MESSAGE_TYPES.SUCCESS,
      };
    }
  }

  return message;
};

const validateCreateOrganizationModalForm = (values: OrganizationModalFormValues) => {
  const errors: Partial<OrganizationModalFormValues> = {};
  if (!values.name) {
    errors.name = 'Organization name is required';
  } else if (values.name && values.name.length > 50) {
    errors.name = 'Organization name must be under 50 characters';
  }

  if (values.description && values.description.length > 200) {
    errors.description = 'Description must be under 200 characters';
  }
  return errors;
};

const getDescriptionFieldUnderMessage = (props: {
  isTouched: boolean | undefined;
  descriptionErrorMessage: string | undefined;
}): InputWithLabelTypes.InputWithLabelFieldMessage | undefined => {
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
};

const getOrganizationModalConfirmButtonDisabledState = (props: {
  isOrganizationNameAvailable: boolean;
  isOrganizationNameCheckInProgress: boolean;
  isOrganizationNameCorrect: boolean;
  isSubmitting: boolean;
  isTouched: FormikTouched<OrganizationModalFormValues>;
  isValid: boolean;
  organizationQueryParam: string | null;
  values: OrganizationModalFormValues;
}) => {
  const {
    isOrganizationNameAvailable,
    isOrganizationNameCheckInProgress,
    isOrganizationNameCorrect,
    isSubmitting,
    isValid,
    organizationQueryParam,
  } = props;

  if (!organizationQueryParam) {
    // Disabled state if create role is active
    return (
      !isOrganizationNameAvailable ||
      !isOrganizationNameCorrect ||
      !isValid ||
      isSubmitting ||
      isOrganizationNameCheckInProgress
    );
  } else {
    // Disabled state if edit role is active
    return (
      isOrganizationNameCheckInProgress ||
      !isValid ||
      isSubmitting ||
      !isOrganizationNameCorrect ||
      !isOrganizationNameAvailable
    );
  }
};

export default CreateUpdateOrganizationModal;
