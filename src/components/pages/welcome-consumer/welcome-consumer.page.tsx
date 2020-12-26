import React, { FunctionComponent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { setCurrentPageTitle } from '@reef-tech/reef-cloud-auth';

/* Components */
import { PageContainer, Image, Button, Paragraph } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Constants */
import { ROUTES } from 'common/constants';

/* Styles */
import './welcome-consumer.scss';

/* Assets */
import ReefLogoImg from 'assets/images/reef-logo-with-name.svg';

export const WelcomeConsumerPage: FunctionComponent = () => {
  const history = useHistory();

  const onSignUpButtonClick = () => {
    history.push(ROUTES.SIGNUP);
  };

  useEffect(() => {
    setCurrentPageTitle('Welcome');
  }, []);

  return (
    <PageContainer>
      <div className="welcome-page__wrapper">
        <Flex.Layout justifyContent="center" className="welcome-page__logo">
          <Image src={ReefLogoImg} className="welcome-page__logo-image" />
        </Flex.Layout>

        <Paragraph textAlign="center">
          This page is created for demo purposes only, and does not represent future Consumer facing page.
        </Paragraph>

        <Flex.Layout justifyContent="center" className="welcome-page__button-wrapper">
          <Button data-testid="welcome-consumer-sign-up-button" onClick={onSignUpButtonClick}>
            Sign up
          </Button>
        </Flex.Layout>
      </div>
    </PageContainer>
  );
};
