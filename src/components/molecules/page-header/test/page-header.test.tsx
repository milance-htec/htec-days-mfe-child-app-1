import React from 'react';
import { cleanup } from '@testing-library/react';
import { PageHeader } from '../page-header.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'page-header-class';
const testStyle = { marginRight: '10px' };
const testBreadcrumbs = true;
const testTitle = 'Test title';
const pageHeaderTestId = 'page-header';

const getWrapper = (title?: string, breadcrumbs?: boolean) => {
  return mount(<PageHeader className={testClass} style={testStyle} title={title} breadcrumbs={breadcrumbs} />);
};

it('Renders without crashing', () => {
  const pageHeader = findByTestId(getWrapper(), pageHeaderTestId);

  expect(pageHeader.hasClass(testClass)).toBeTruthy();
  expect(pageHeader.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with title and breadcrumbs', () => {
  const pageHeader = findByTestId(getWrapper(testTitle, testBreadcrumbs), pageHeaderTestId);

  expect(pageHeader.hasClass(testClass)).toBeTruthy();
  expect(pageHeader.prop('style')).toEqual(testStyle);
});
