import React, { FunctionComponent } from 'react';
import { Formik, Form } from 'formik';

/* Components */
import { Modal, Heading, Button } from 'components/atoms';
import { InputWithLabel, Flex } from 'components/molecules';

/* Types and constants */
import { CreateUpdateRoleModalProps } from './create-update-role.types';

/* Utility */
import {
  getDescriptionFieldUnderMessage,
  getRoleModalConfirmButtonDisabledState,
  getRoleNameFieldUnderMessage,
  validateCreateRoleModalForm,
} from './create-update-role.utility';

export const CreateUpdateRoleModal: FunctionComponent<CreateUpdateRoleModalProps> = ({
  formInitialValues = {},
  isRoleNameAvailable = null,
  isRoleNameCheckInProgress = false,
  isRoleNameCorrect = false,
  modalState = false,
  modalTitle,
  onRoleNameChange,
  roleModalConfirmButtonText = '',
  roleQueryParam,
  selectedRole,
  setModalState,
  submitForm,
}) =>
  modalState ? (
    <Modal
      showModal={modalState}
      heading={modalTitle}
      onModalBlur={setModalState(false, {
        clearParams: roleQueryParam ? true : false,
      })}
      closeButtonIconDisabled={isRoleNameCheckInProgress}
    >
      <Formik
        initialValues={formInitialValues}
        validate={validateCreateRoleModalForm}
        onSubmit={submitForm}
        initialErrors={{}}
      >
        {({ values, errors, isValid, touched, handleChange, setFieldTouched, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} noValidate autoComplete="off">
            {/* Role name input */}
            <Heading type={5} style={{ marginBottom: '0px', color: '#000000' }}>
              Role Name
            </Heading>
            <InputWithLabel
              name="name"
              onChange={onRoleNameChange && onRoleNameChange(handleChange)}
              onTouched={setFieldTouched}
              placeholder="Add role name*"
              type="text"
              value={values.name}
              message={getRoleNameFieldUnderMessage({
                isRoleNameFormatCorrect: isRoleNameCorrect,
                isTouched: touched.name,
                roleErrorMessage: errors.name,
                roleName: values.name,
                roleNameAvailable: isRoleNameAvailable,
                selectedRole,
              })}
            />

            {/* Description input */}
            <Heading type={5} style={{ marginBottom: '0px', color: '#000000' }}>
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
              <Button
                id="roles-page-create-update-role-modal-create-edit-button"
                type="submit"
                disabled={getRoleModalConfirmButtonDisabledState({
                  isRoleNameAvailable: !!isRoleNameAvailable,
                  isRoleNameCheckInProgress,
                  isRoleNameCorrect,
                  isSubmitting,
                  isTouched: touched,
                  isValid,
                  roleQueryParam,
                  values,
                })}
              >
                {roleModalConfirmButtonText}
              </Button>
            </Flex.Layout>
          </Form>
        )}
      </Formik>
    </Modal>
  ) : null;
