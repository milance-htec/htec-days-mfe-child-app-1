import React from 'react';
import { cleanup } from '@testing-library/react';
import { WelcomeConsumerPage } from '../welcome-consumer.page';
import { mount } from 'enzyme';
import { findByTestId, WithMaterialTheme, WithRouter } from 'common/test-utility';
import { ReefCloudTheme } from 'common/material-ui';

afterEach(cleanup);

const welcomeConsumerPageContainerTestId = 'page-container';
const welcomeConsumerPageSignUpButtonTestId = 'welcome-consumer-sign-up-button';

const getWrapper = () => {
  return mount(WithMaterialTheme(WithRouter(<WelcomeConsumerPage />), ReefCloudTheme));
};

it('Renders without crashing', () => {
  const welcomeConsumerPage = findByTestId(getWrapper(), welcomeConsumerPageContainerTestId);
  expect(welcomeConsumerPage.length).not.toBe(0);
});

it('Renders without crashing with sign up button click', () => {
  const welcomeConsumerPage = findByTestId(getWrapper(), welcomeConsumerPageContainerTestId);
  const welcomeConsumerPageSignUpButton = findByTestId(welcomeConsumerPage, welcomeConsumerPageSignUpButtonTestId);
  expect(welcomeConsumerPage.length).not.toBe(0);
  welcomeConsumerPageSignUpButton.simulate('click');
});
