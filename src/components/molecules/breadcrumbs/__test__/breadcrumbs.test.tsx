import React from 'react';
import { cleanup } from '@testing-library/react';
import { Breadcrumbs } from '../breadcrumbs.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'breadcrumbs-class';
const testStyle = { marginRight: '10px' };
const testCrumbsString = ['Test Crumbs', 'Test Crumbs'];
const testCrumbsObject = [
  { title: 'Test Crumbs', onClick: () => {} },
  { test: 'Test Crumbs', onClick: () => {} },
];
const testBadCrumbs = [1, 2];
const breadcrumbsTestId = 'breadcrumbs';
const breadcrumbsCrumbTestId = 'breadcrumbs-crumb-0';

const getWrapper = (crumbs: string[] | any[]) => {
  return mount(<Breadcrumbs crumbs={crumbs} className={testClass} style={testStyle} />);
};

it('Renders without crashing', () => {
  const breadcrumbs = findByTestId(getWrapper(testCrumbsString), breadcrumbsTestId);

  expect(breadcrumbs.hasClass(testClass)).toBeTruthy();
  expect(breadcrumbs.prop('style')).toEqual(testStyle);
});

it('Renders breadcrumbs with object crumbs', () => {
  const breadcrumbs = findByTestId(getWrapper(testCrumbsObject), breadcrumbsTestId);

  expect(breadcrumbs.hasClass(testClass)).toBeTruthy();
  expect(breadcrumbs.prop('style')).toEqual(testStyle);
});

it('Do not render breadcrumbs with bad crumbs', () => {
  const breadcrumbs = findByTestId(getWrapper(testBadCrumbs), breadcrumbsCrumbTestId);

  expect(breadcrumbs).toEqual({});
});
