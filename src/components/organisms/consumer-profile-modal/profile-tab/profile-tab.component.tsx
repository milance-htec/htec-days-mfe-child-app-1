import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import { useMutation } from '@apollo/react-hooks';
import { isEqual } from 'lodash';

/* Components */
import { Button, FormikContext, UserAvatar, Text } from 'components/atoms';
import {
  FormInput,
  Loader,
  Flex,
  UserProfileModalContent,
  UserProfileTabSection,
  setToastMessage,
} from 'components/molecules';
import { Paper } from '@material-ui/core';

/* Types */
import {
  UserInformationFormValues,
  ContactInformationFormValues,
  ProfileTabProps,
  GQLUpdateConsumerResult,
  GQLUpdateConsumerVariables,
} from './profile-tab.types';

/* Constants */
import {
  GQL_UPDATE_CONSUMER_MUTATION,
  PROFILE_TAB_ERROR_KEY,
  PROFILE_TAB_FIELD_NAME,
  PROFILE_TAB_FIRST_NAME_LIMIT,
  PROFILE_TAB_LAST_NAME_LIMIT,
} from './profile-tab.constants';

/* Utility */
import { getInputErrorMessage } from 'common/utility';
import { validateUserInformationForm, validateContactInformationForm } from './profile-tab.utility';

/* Styles */
import './profile-tab.scss';

export const ProfileTab: FunctionComponent<ProfileTabProps> = ({ consumer, onConsumerUpdated }) => {
  const userInformationFormRef = useRef<FormikProps<UserInformationFormValues> | null>();
  const contactInformationFormRef = useRef<FormikProps<ContactInformationFormValues> | null>();

  // Form
  const [isUserInformationFormValid, setIsUserInformationFormValid] = useState(true);
  const [isContactInformationFormValid, setIsContactInformationFormValid] = useState(true);

  const [isUserInformationFormSubmitted, setIsUserInformationFormSubmitted] = useState(false);
  const [isContactInformationFormSubmitted, setIsContactInformationFormSubmitted] = useState(false);

  const [userInformationValuesToUpdate, setUserInformationValuesToUpdate] = useState<UserInformationFormValues | null>(
    null,
  );
  const [
    contactInformationValuesToUpdate,
    setContactInformationValuesToUpdate,
  ] = useState<ContactInformationFormValues | null>(null);

  const [
    contactInformationFromikHelpers,
    setContactInformationFromikHelpers,
  ] = useState<FormikHelpers<ContactInformationFormValues> | null>(null);

  const [
    userInformationFormInitialValues,
    setUserInformationFormInitialValues,
  ] = useState<UserInformationFormValues | null>(null);

  const [
    contactInformationFormInitialValues,
    setContactInformationFormInitialValues,
  ] = useState<ContactInformationFormValues | null>(null);

  const [updateConsumer, { data: updateConsumerData, error: updateConsumerError }] = useMutation<
    GQLUpdateConsumerResult,
    GQLUpdateConsumerVariables
  >(GQL_UPDATE_CONSUMER_MUTATION);

  const [userInformationValuesUpdated, setUserInformationValuesUpdated] = useState(false);
  const [contactInformationValuesUpdated, setContactInformationValuesUpdated] = useState(false);

  /* Form */
  const onUserInformationSubmitClick = (values: UserInformationFormValues) => {
    setUserInformationValuesToUpdate(values);
    setIsUserInformationFormSubmitted(true);
    updateConsumer({
      variables: {
        userId: consumer?.id ? consumer.id : 0,
        userInformation: values,
      },
    });
  };

  const onContactInformationClick = (
    values: ContactInformationFormValues,
    formikHelpers: FormikHelpers<ContactInformationFormValues>,
  ) => {
    setContactInformationValuesToUpdate(values);
    setContactInformationFromikHelpers(formikHelpers);
    setIsContactInformationFormSubmitted(true);
    updateConsumer({
      variables: {
        userId: consumer?.id ? consumer.id : 0,
        contactInformation: values,
      },
    });
  };

  const areUserInformationValuesUpdated = (values: UserInformationFormValues) => {
    if (isEqual(values, userInformationFormInitialValues)) {
      setUserInformationValuesUpdated(false);
    } else {
      setUserInformationValuesUpdated(true);
    }
  };

  const areContactInformationValuesUpdated = (values: ContactInformationFormValues) => {
    if (isEqual(values, contactInformationFormInitialValues)) {
      setContactInformationValuesUpdated(false);
    } else {
      setContactInformationValuesUpdated(true);
    }
  };

  const onUserInformationValuesChange = (values: UserInformationFormValues) => {
    areUserInformationValuesUpdated(values);
  };

  const onContactInformationValuesChange = (values: ContactInformationFormValues) => {
    areContactInformationValuesUpdated(values);
  };

  /* Update user profile loading hook */

  useEffect(() => {
    if (isUserInformationFormSubmitted) {
      setIsUserInformationFormSubmitted(false);
    }
    if (isContactInformationFormSubmitted) {
      setIsContactInformationFormSubmitted(false);
    }
    // eslint-disable-next-line
  }, [isUserInformationFormSubmitted, isContactInformationFormSubmitted]);

  useEffect(() => {
    if (consumer) {
      setUserInformationFormInitialValues({
        firstName: consumer.givenName ?? '',
        lastName: consumer.familyName ?? '',
      });
      setContactInformationFormInitialValues({
        email: consumer.email ?? '',
        phoneNumber: consumer.phoneNumber ?? '',
      });
    }
  }, [consumer]);

  useEffect(() => {
    if (updateConsumerData?.updateConsumerUser) {
      if (userInformationValuesToUpdate) {
        setUserInformationFormInitialValues({
          firstName: userInformationValuesToUpdate.firstName,
          lastName: userInformationValuesToUpdate.lastName,
        });
        setToastMessage('User information successfully updated!');
        setUserInformationValuesToUpdate(null);
      }
      if (contactInformationValuesToUpdate) {
        setContactInformationFormInitialValues({
          email: contactInformationValuesToUpdate.email,
          phoneNumber: contactInformationValuesToUpdate.phoneNumber,
        });
        setToastMessage('Contact information successfully updated!');
        setContactInformationValuesToUpdate(null);
        setContactInformationFromikHelpers(null);
      }
      onConsumerUpdated();
    }
    // eslint-disable-next-line
  }, [updateConsumerData]);

  useEffect(() => {
    if (updateConsumerError) {
      if (updateConsumerError.graphQLErrors) {
        if (contactInformationFromikHelpers) {
          updateConsumerError.graphQLErrors.forEach((error) => {
            switch (error.extensions?.response.body.messageKey) {
              case PROFILE_TAB_ERROR_KEY.EMAIL_EXISTS:
                contactInformationFromikHelpers.setFieldError(PROFILE_TAB_FIELD_NAME.EMAIL, 'Email already exists');
                break;
              case PROFILE_TAB_ERROR_KEY.PHONE_NUMBER_EXISTS:
                contactInformationFromikHelpers.setFieldError(
                  PROFILE_TAB_FIELD_NAME.PHONE_NUMBER,
                  'Phone number already exists',
                );
                break;
            }
          });
        }
      }
      if (userInformationValuesToUpdate) {
        setUserInformationValuesToUpdate(null);
      }
      if (contactInformationValuesToUpdate) {
        setContactInformationValuesToUpdate(null);
        setContactInformationFromikHelpers(null);
      }
    }
    // eslint-disable-next-line
  }, [updateConsumerError]);

  return !consumer || !userInformationFormInitialValues || !contactInformationFormInitialValues ? (
    <Loader loaderFlag={true} backgroundOpacityPointVariant={2} />
  ) : (
    // Content
    <UserProfileModalContent
      title="Profile"
      description="You are about to manage personal information, and control which information other people see and apps may access."
    >
      <>
        <Formik
          initialValues={userInformationFormInitialValues}
          innerRef={(ref) => (userInformationFormRef.current = ref)}
          onSubmit={onUserInformationSubmitClick}
          validate={validateUserInformationForm(setIsUserInformationFormValid)}
        >
          {({ values, errors, handleSubmit, handleChange, touched, setFieldTouched }) => (
            <>
              <Form onSubmit={handleSubmit}>
                {/* Profile picture section */}
                <UserProfileTabSection title="Profile Picture">
                  <UserAvatar
                    className="profile-tab__profile-picture"
                    email={consumer?.email}
                    firstName={consumer?.givenName}
                    isUserActive
                    lastName={consumer?.familyName}
                  />
                </UserProfileTabSection>

                {/* User information */}
                <UserProfileTabSection title="User Information">
                  {/* First name */}
                  <FormInput
                    bottomSpacing
                    changed={userInformationFormInitialValues.firstName !== values.firstName}
                    maxLength={PROFILE_TAB_FIRST_NAME_LIMIT}
                    name="firstName"
                    placeholder="First Name"
                    value={values.firstName}
                    onChange={handleChange}
                    onTouched={setFieldTouched}
                    message={getInputErrorMessage({
                      message: errors.firstName,
                      touched: touched.firstName,
                    })}
                    disabled={consumer?.isSsoUser}
                  />

                  {/* Last name */}
                  <FormInput
                    maxLength={PROFILE_TAB_LAST_NAME_LIMIT}
                    changed={userInformationFormInitialValues.lastName !== values.lastName}
                    name="lastName"
                    placeholder="Last Name"
                    value={values.lastName}
                    onChange={handleChange}
                    onTouched={setFieldTouched}
                    message={getInputErrorMessage({
                      message: errors.lastName,
                      touched: touched.lastName,
                    })}
                    disabled={consumer?.isSsoUser}
                  />
                </UserProfileTabSection>

                {/* Hidden submit button for ENTER save */}
                <Flex.Layout className="form-actions" alignItems="center" justifyContent="space-between">
                  <Button type="submit" disabled={!isUserInformationFormValid || !userInformationValuesUpdated}>
                    SAVE CHANGES
                  </Button>
                  <Button variant="secondary">CANCEL</Button>
                </Flex.Layout>
              </Form>
              <FormikContext onValuesUpdate={onUserInformationValuesChange} />
            </>
          )}
        </Formik>
        <Formik
          initialValues={contactInformationFormInitialValues}
          innerRef={(ref) => (contactInformationFormRef.current = ref)}
          onSubmit={onContactInformationClick}
          validate={validateContactInformationForm(setIsContactInformationFormValid)}
        >
          {({ values, errors, handleSubmit, handleChange, touched, setFieldTouched }) => (
            <>
              <Form onSubmit={handleSubmit}>
                {/* Contact information */}
                <UserProfileTabSection title="Contact Information">
                  {/* Email */}
                  <FormInput
                    bottomSpacing
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    onTouched={setFieldTouched}
                    message={getInputErrorMessage({
                      message: errors.email,
                      touched: touched.email,
                    })}
                    changed={contactInformationFormInitialValues.email !== values.email}
                    value={values.email}
                  />

                  {/* Phone number */}
                  <FormInput
                    bottomSpacing
                    name="phoneNumber"
                    placeholder="Mobile Phone number"
                    onChange={handleChange}
                    onTouched={setFieldTouched}
                    message={getInputErrorMessage({
                      message: errors.phoneNumber,
                      touched: touched.phoneNumber,
                    })}
                    value={values.phoneNumber}
                    changed={contactInformationFormInitialValues.phoneNumber !== values.phoneNumber}
                  />

                  <Paper className="contact-information__warning" variant="outlined">
                    <Flex.Layout
                      className="contact-information__warning--content"
                      alignItems="flex-start"
                      justifyContent="center"
                      flexDirection="column"
                    >
                      <Text bold color="primary" className="contact-information__warning--title">
                        Email/Mobile Phone Number Change
                      </Text>
                      <Text color="primary" className="contact-information__warning--text">
                        Changing this details can and will affect users acces to this platform
                      </Text>
                    </Flex.Layout>
                  </Paper>
                </UserProfileTabSection>

                {/* Hidden submit button for ENTER save */}
                <Flex.Layout className="form-actions" alignItems="center" justifyContent="space-between">
                  <Button type="submit" disabled={!isContactInformationFormValid || !contactInformationValuesUpdated}>
                    SAVE CHANGES
                  </Button>
                  <Button variant="secondary">CANCEL</Button>
                </Flex.Layout>
              </Form>

              <FormikContext onValuesUpdate={onContactInformationValuesChange} />
            </>
          )}
        </Formik>
      </>
    </UserProfileModalContent>
  );
};
