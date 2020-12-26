import React from 'react';
import { cleanup } from '@testing-library/react';
import { Loader } from '../loader.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'loader-class';
const testStyle = { marginRight: '10px' };
const hasLoaderTest = true;
const loaderTestId = 'loader';

const getWrapper = (loaderFlag = false) => {
  return mount(<Loader loaderFlag={loaderFlag} className={testClass} style={testStyle} />);
};

it('Renders without crashing', () => {
  const loader = findByTestId(getWrapper(), loaderTestId);

  expect(loader.length).toBe(0);
});

it('Renders without crashing with loaderFlag', () => {
  const loader = findByTestId(getWrapper(hasLoaderTest), loaderTestId);

  expect(loader.hasClass(testClass)).toBeTruthy();
  expect(loader.prop('style')).toEqual(testStyle);
});
