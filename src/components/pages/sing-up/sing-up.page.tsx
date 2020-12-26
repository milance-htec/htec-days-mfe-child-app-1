import React, { useState, FunctionComponent, useEffect } from 'react';

/* Components */
import { PageContainer, HorizontalLine, Image, Link, Paragraph, Text, WindowContentContainer } from 'components/atoms';
import { Flex } from 'components/molecules';

import SignUpWithEmailForm from './forms/sign-up-with-email';
import SignUpWithEmailSuccessModal from './modals/sign-up-with-emal-success-modal';

/* Constants */
import { ROUTES } from 'common/constants';

/* Types */
import { SignUpActiveForm } from './sing-up.types';

/* Styles */
import './sing-up.scss';

/* Assets */
import ReefLogoImg from 'assets/images/reef-logo-with-name.svg';
import { setCurrentPageTitle } from '@reef-tech/reef-cloud-auth';

export const SignUpPage: FunctionComponent = () => {
  const [activeForm, setActiveForm] = useState<SignUpActiveForm>('email');

  const [signUpWithEmailSuccessModalState, setSignUpWithEmailSuccessModalState] = useState(false);

  // Success modals
  const setSingUpWithEmailSuccessModalStatus = (state: boolean) => () => {
    setSignUpWithEmailSuccessModalState(state);
  };

  const onSignUpWithEmailSuccess = () => {
    setSingUpWithEmailSuccessModalStatus(true)();
  };

  // Switch forms
  const getActiveForm = () => {
    if (activeForm === 'email') {
      return <SignUpWithEmailForm onSignUpSuccess={onSignUpWithEmailSuccess} />;
    }
  };

  const switchSignUpForm = () => {
    setActiveForm('email');
  };

  /* Set page title */

  useEffect(() => {
    setCurrentPageTitle('Sign up');
  }, []);

  /* Render */
  return (
    <PageContainer scrollable className="sign-up-page">
      {/* Dont show any content if modal success modal is present */}
      {!signUpWithEmailSuccessModalState ? (
        <>
          <Flex.Layout justifyContent="center">
            <Image src={ReefLogoImg} className="sign-up-page__logo" />
          </Flex.Layout>

          <Flex.Layout justifyContent="center">
            <WindowContentContainer className="sign-up-page__window-content-wrapper">
              {/* Heading */}
              <Flex.Layout justifyContent="center">
                <Text className="sign-up-page__heading" bold>
                  Reef Sign Up
                </Text>
              </Flex.Layout>

              {/* Form type switcher */}
              <Flex.Layout justifyContent="space-between" className="sign-up-page-type-switcher">
                <Text bold color="secondary1">
                  Email
                </Text>
                <Text color="link" className="sign-up-page-type-switcher__link" onClick={switchSignUpForm}>
                  Sign up with phone
                </Text>
              </Flex.Layout>

              {/* Active form */}
              {getActiveForm()}

              {/* Terms */}
              <Paragraph className="sign-up-page-form__terms-text" textAlign="center">
                By continuing, you agree to Reef’s <Text bold>Terms of Use</Text> and <br />
                confirm that you have read Reefs’s <Text bold>Privacy Policy</Text>.
              </Paragraph>

              <HorizontalLine />

              {/* Back to login */}
              <Flex.Layout justifyContent="center" className="sign-up-page-form__go-to-login">
                Already have an account?&nbsp;
                <Link href={ROUTES.LOGIN}>Log in</Link>
              </Flex.Layout>
            </WindowContentContainer>
          </Flex.Layout>
        </>
      ) : null}

      {/* Modals */}
      <SignUpWithEmailSuccessModal
        modalState={signUpWithEmailSuccessModalState}
        setModalState={setSingUpWithEmailSuccessModalStatus}
      />
    </PageContainer>
  );
};
