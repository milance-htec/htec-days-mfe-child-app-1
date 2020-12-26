import React from 'react';
import { cleanup } from '@testing-library/react';
import { HomePage } from '../home.page';
import { mount } from 'enzyme';
import { findByTestId, withOptimizelyProvider } from 'common/test-utility';

afterEach(cleanup);

const homePageContainerTestId = 'page-container';

const getWrapper = () => {
  return mount(withOptimizelyProvider(<HomePage />));
};

it('Renders without crashing', () => {
  const homePage = findByTestId(getWrapper(), homePageContainerTestId);
  expect(homePage.length).not.toBe(0);
});
