import React, { FunctionComponent, useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useDebouncedCallback } from 'use-debounce';

/* Components */
import { Button, ItemHolder } from 'components/atoms';
import { FormInput, Flex, Recaptcha, Loader } from 'components/molecules';

/* Types */
import {
  GQLCheckIfEmailExistsResult,
  GQLCheckIfEmailExistsVariables,
  SignUpWithEmailFormValues,
  GQLSendCodeForEmailResult,
  GQLSendCodeForEmailVariables,
  GQLSubmitSignUpWithEmailResult,
  GQLSubmitSignUpWithEmailVariables,
  SignUpWithEmailFormProps,
  GQLGetUserOrganizationsResult,
  GQLGetUserOrganizationsVariables,
} from './sign-up-with-email.types';
import { FormikSetFieldValue, OnInputChange } from 'common/types';

/* Constants */
import {
  GQL_CHECK_IF_EMAIL_EXISTS_QUERY,
  SIGN_UP_WITH_EMAIL_FORM_INITIAL_VALUES,
  CHECK_IF_EMAIL_EXISTS_DEBOUNCE_TIMEOUT,
  GQL_SEND_CODE_FOR_EMAIL_MUTATION,
  GQL_SUBMIT_SIGN_UP_WITH_EMAIL_MUTATION,
  GET_USER_ORGANIZATIONS,
} from './sign-up-with-email.constants';
import { setToastMessage } from 'components/molecules/toast-message-content';

/* Utility */
import {
  signUpWithEmailFormValidate,
  getSignUpWithEmailSubmitButtonDisabledState,
  getEmailMessage,
  getCodeMessage,
} from './sign-up-with-email.utility';
import { validateEmail } from 'common/utility';
import { isDevEnv } from 'App';

const SignUpWithEmailForm: FunctionComponent<SignUpWithEmailFormProps> = ({ onSignUpSuccess }) => {
  const [isRecaptchaValid, setIsRecaptchaValid] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isCheckIfEmailExistsInProgress, setIsCheckIfEmailExistsInProgress] = useState(false);
  const [isEmailDomainValid, setIsEmailDomainValid] = useState(true);

  const [isSentCodeInvalid, setIsSentCodeInvalid] = useState(false);
  const [sendCodeSession, setSendCodeSession] = useState<string | null>(null);
  const [isCodeExpired, setIsCodeExpired] = useState(false);

  const [tempAccessToken, setTempAccessToken] = useState<string | null>(null);

  // Check if email exists GQL
  const [checkIfEmailExists, { data: checkIfEmailExistsData, loading: checkIfEmailExistsLoading }] = useLazyQuery<
    GQLCheckIfEmailExistsResult,
    GQLCheckIfEmailExistsVariables
  >(GQL_CHECK_IF_EMAIL_EXISTS_QUERY, {
    context: {
      isOpen: true,
    },
  });

  const checkIfEmailExistsWithDebounce = useDebouncedCallback(
    checkIfEmailExists,
    CHECK_IF_EMAIL_EXISTS_DEBOUNCE_TIMEOUT,
  );

  // Send code GQL
  const [
    sendCodeForEmail,
    { data: sendCodeForEmailData, loading: sendCodeForEmailLoadng, error: sendCodeForEmailError },
  ] = useMutation<GQLSendCodeForEmailResult, GQLSendCodeForEmailVariables>(GQL_SEND_CODE_FOR_EMAIL_MUTATION, {
    context: {
      isOpen: true,
    },
  });

  // Submit form GQL
  const [submitForm, { data: submitFormData, loading: submitFormLoadng, error: submitFormError }] = useMutation<
    GQLSubmitSignUpWithEmailResult,
    GQLSubmitSignUpWithEmailVariables
  >(GQL_SUBMIT_SIGN_UP_WITH_EMAIL_MUTATION, {
    context: {
      isOpen: true,
    },
  });

  // Get user organizations GQL
  const [getUserOrganiazations, { data: getUserOrganiazationsData }] = useLazyQuery<
    GQLGetUserOrganizationsResult,
    GQLGetUserOrganizationsVariables
  >(GET_USER_ORGANIZATIONS);

  /* ----- Logic ------ */
  // Submit
  const signUpWithEmailSubmit = ({ email, code }: SignUpWithEmailFormValues) => {
    if (sendCodeSession) {
      submitForm({
        variables: {
          email,
          code,
          session: sendCodeSession,
        },
      });
    }
  };

  // Recaptcha
  const onRecaptchaChange = (recaptchaCode: string | null) => {
    setIsRecaptchaValid(!!recaptchaCode);
  };

  // Code
  const sendCode = (setFieldValue: FormikSetFieldValue<SignUpWithEmailFormValues>, email: string) => () => {
    if (sendCodeSession) {
      resetCodeInputRelatedCode(setFieldValue)();
    }

    sendCodeForEmail({
      variables: {
        email,
      },
    });
  };

  // Email
  const handleEmailChange: (
    changeHandler: OnInputChange,
    setFieldValue: FormikSetFieldValue<SignUpWithEmailFormValues>,
  ) => OnInputChange = (changeHandler, setFieldValue) => (e) => {
    const emailValue = e.target.value;

    if (sendCodeSession) {
      resetCodeInputRelatedCode(setFieldValue)();
    }

    if (!isEmailDomainValid) {
      setIsEmailDomainValid(true);
    }

    if (emailValue && validateEmail(emailValue)) {
      setIsCheckIfEmailExistsInProgress(true);

      checkIfEmailExistsWithDebounce.callback({
        variables: {
          email: emailValue,
        },
      });
    }

    changeHandler(e);
  };

  const resetCodeInputRelatedCode = (setFieldValue: FormikSetFieldValue<SignUpWithEmailFormValues>) => () => {
    setFieldValue('code', '');
    setSendCodeSession(null);
    setIsCodeExpired(false);
  };

  const handleCodeChange: (changeHandler: OnInputChange) => OnInputChange = (changeHandler) => (e) => {
    changeHandler(e);

    if (isSentCodeInvalid) {
      setIsSentCodeInvalid(false);
    }
  };

  /* On check if email exists hook */
  useEffect(() => {
    if (checkIfEmailExistsData) {
      if (checkIfEmailExistsData.consumerUserEmailExists !== null) {
        setIsCheckIfEmailExistsInProgress(false);
        setIsEmailAvailable(!checkIfEmailExistsData.consumerUserEmailExists);
      }
    }
  }, [checkIfEmailExistsData]);

  /* Send code for email data hook */
  useEffect(() => {
    if (sendCodeForEmailData && sendCodeForEmailData.passwordlessConsumerUserSignUp !== null) {
      setSendCodeSession(sendCodeForEmailData.passwordlessConsumerUserSignUp.session);

      setToastMessage('Code sent successfully');
    }
  }, [sendCodeForEmailData]);

  /* Send code error hook */
  useEffect(() => {
    if (sendCodeForEmailError) {
      if (sendCodeForEmailError.graphQLErrors && sendCodeForEmailError.graphQLErrors.length) {
        const message = sendCodeForEmailError.graphQLErrors[0].extensions?.response?.body?.messageKey;

        if (message === 'bad.request') {
          setIsEmailDomainValid(false);
        }
      }
    }
  }, [sendCodeForEmailError]);

  /* Submit form hook */
  useEffect(() => {
    if (submitFormData && submitFormData.confirmPasswordlessConsumerUserSignUp !== null) {
      const submitFormResultData = submitFormData.confirmPasswordlessConsumerUserSignUp;

      if (!submitFormResultData.successfulAuthentication) {
        setIsSentCodeInvalid(true);
        setSendCodeSession(submitFormResultData.session);
      } else {
        setTempAccessToken(submitFormResultData.authenticationResponse.accessToken);

        getUserOrganiazations({
          context: {
            tempAccessToken: submitFormResultData.authenticationResponse.accessToken,
          },
          variables: {
            pageSize: 1,
          },
        });
      }
    }
    // eslint-disable-next-line
  }, [submitFormData]);

  /* Submit error hook */
  useEffect(() => {
    if (submitFormError) {
      if (submitFormError.graphQLErrors && submitFormError.graphQLErrors.length) {
        const message = submitFormError.graphQLErrors[0].extensions?.response?.body?.messageKey;

        if (message === 'bad.credentials') {
          setIsCodeExpired(true);
        }
      }
    }
  }, [submitFormError]);

  /* Get user organizations hook */
  useEffect(() => {
    if (getUserOrganiazationsData) {
      if (getUserOrganiazationsData.userOrganizations !== null) {
        if (getUserOrganiazationsData.userOrganizations.content.length && tempAccessToken) {
          onSignUpSuccess();
        }
      }
    }
    // eslint-disable-next-line
  }, [getUserOrganiazationsData]);

  return (
    <>
      <Loader loaderFlag={submitFormLoadng || sendCodeForEmailLoadng} />

      <Formik
        initialValues={SIGN_UP_WITH_EMAIL_FORM_INITIAL_VALUES}
        validateOnMount
        onSubmit={signUpWithEmailSubmit}
        validate={signUpWithEmailFormValidate}
      >
        {({ values, touched, setFieldTouched, handleChange, errors, setFieldValue }) => (
          <Form autoComplete="off" noValidate={false}>
            {/* Email */}
            <FormInput
              bottomSpacing
              name="email"
              placeholder="Your Email"
              topSpacing
              value={values.email}
              onChange={handleEmailChange(handleChange, setFieldValue)}
              onTouched={setFieldTouched}
              message={getEmailMessage({
                isCheckIfEmailExistsInProgress,
                isEmailAvailable,
                isEmailDomainValid,
                errorProps: {
                  touched: touched.email,
                  message: errors.email,
                },
              })}
            />

            {/* Send code button */}
            <Button
              variant="secondary"
              onClick={sendCode(setFieldValue, values.email)}
              disabled={!!errors.email || !isEmailAvailable || isCheckIfEmailExistsInProgress || sendCodeForEmailLoadng}
            >
              {sendCodeSession ? 'RESEND CODE' : 'SEND CODE'}
            </Button>

            {/* Code */}
            <FormInput
              autoComplete={false}
              bottomSpacing
              disabled={!sendCodeSession}
              maxLength={6}
              name="code"
              onlyNumber
              placeholder="Enter 6 digit code"
              topSpacing
              value={values.code}
              onChange={handleCodeChange(handleChange)}
              onTouched={setFieldTouched}
              message={getCodeMessage({
                errorProps: {
                  touched: touched.code,
                  message: errors.code,
                },
                isCodeExpired,
                isSentCodeInvalid,
              })}
            />

            {/* Recaptcha */}
            <Flex.Layout justifyContent="center">
              <ItemHolder topSpacing bottomSpacing>
                <Recaptcha onChange={onRecaptchaChange} siteKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY as string} />
              </ItemHolder>
            </Flex.Layout>

            {/* Submit button */}
            <Flex.Layout justifyContent="center">
              <Button
                type="submit"
                disabled={getSignUpWithEmailSubmitButtonDisabledState({
                  formInputErrors: errors,
                  isCodeExpired,
                  isEmailAvailable,
                  isEmailDomainValid,
                  isRecaptchaValid: isDevEnv ? true : isRecaptchaValid,
                  loadingsInProgress: checkIfEmailExistsLoading,
                })}
              >
                CREATE ACCOUNT
              </Button>
            </Flex.Layout>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SignUpWithEmailForm;
