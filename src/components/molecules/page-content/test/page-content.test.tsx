import React from 'react';
import { cleanup } from '@testing-library/react';
import { PageContent } from '../page-content.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'page-content-class';
const testStyle = { marginRight: '10px' };
const pageContentTestId = 'page-content';

const getWrapper = () => {
  return mount(<PageContent className={testClass} style={testStyle} />);
};

it('Renders without crashing', () => {
  const pageContent = findByTestId(getWrapper(), pageContentTestId);

  expect(pageContent.hasClass(testClass)).toBeTruthy();
  expect(pageContent.prop('style')).toEqual(testStyle);
});
