import { mount, ReactWrapper, ShallowWrapper } from 'enzyme';

/* Apollo */
import { MockedProvider } from '@apollo/client/testing';
import React from 'react';
import { DocumentNode } from 'graphql';

/* Router */
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Theme, ThemeProvider } from '@material-ui/core';

/* Optimizely */
import { createInstance, OptimizelyProvider } from '@optimizely/react-sdk';

export interface ApolloMock {
  request: {
    query: DocumentNode;
    variables: any;
  };
  result: any;
}
export const findByTestId = (wrapper: ReactWrapper | ShallowWrapper, testId: string) => {
  return wrapper.find(`[data-testid='${testId}']`);
};

/**
 * Utility function that mocks the `IntersectionObserver` API. Necessary for components that rely
 * on it, otherwise the tests will crash. Recommended to execute inside `beforeEach`.
 * @param intersectionObserverMock - Parameter that is sent to the `Object.defineProperty`
 * overwrite method. `jest.fn()` mock functions can be passed here if the goal is to not only
 * mock the intersection observer, but its methods.
 */
export const setupIntersectionObserverMock = ({
  root = null,
  rootMargin = '',
  thresholds = [],
  disconnect = () => null,
  observe = () => null,
  takeRecords = () => [],
  unobserve = () => null,
} = {}): void => {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = root;
    readonly rootMargin: string = rootMargin;
    readonly thresholds: ReadonlyArray<number> = thresholds;
    disconnect: () => void = disconnect;
    observe: (target: Element) => void = observe;
    takeRecords: () => IntersectionObserverEntry[] = takeRecords;
    unobserve: (target: Element) => void = unobserve;
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
};

export const WithApolloClient = (component: JSX.Element, mocks: ApolloMock[]) => {
  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      {component}
    </MockedProvider>
  );
};

export const WithRouter = (component: JSX.Element, historyOptions?: any) => {
  const history = createMemoryHistory(historyOptions);
  return <Router history={history}>{component}</Router>;
};

export const WithMaterialTheme = (component: JSX.Element, theme: Theme) => {
  return <ThemeProvider theme={theme}>{component}</ThemeProvider>;
};

/**
 * Helper function to enzyme mount the provided component wrapped in an <OptimizelyProvider /> context.
 */
export const withOptimizelyProvider = (component: JSX.Element) => {
  const optimizely = createInstance({
    sdkKey: process.env.REACT_APP_OPTIMIZELY_SDK_KEY,
    eventFlushInterval: 1000,
    eventBatchSize: 10,
  });
  return (
    <OptimizelyProvider optimizely={optimizely} userId="reefuser">
      {component}
    </OptimizelyProvider>
  );
};
