import React from 'react';
import { cleanup } from '@testing-library/react';
import { Accordion } from '../accordion.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'accoirdion-class';
const testStyle = { marginRight: '10px' };
const accordionTestId = 'accordion';
const accordionIconTestId = 'accordion-icon';

const getWrapper = (content: any, expandible: any, expandHandler?: any) => {
  return mount(
    <Accordion
      className={testClass}
      style={testStyle}
      content={content}
      expandible={expandible}
      onExpandChange={expandHandler}
    />,
  );
};

it('Renders without crashing', () => {
  const content = <div></div>;
  const expandible = <div></div>;
  const accordion = findByTestId(getWrapper(content, expandible), accordionTestId);

  expect(accordion.hasClass(testClass)).toBeTruthy();
  expect(accordion.prop('style')).toEqual(testStyle);
});

it('Renders accordion with handler', () => {
  const content = <div></div>;
  const expandible = <div></div>;
  const expandHandler = jest.fn(() => {});
  const icon = findByTestId(getWrapper(content, expandible, expandHandler), accordionIconTestId);
  icon.simulate('click');
  expect(expandHandler).toBeCalled();
});

it('Renders accordion without handler', () => {
  const content = <div></div>;
  const expandible = <div></div>;
  const wrapper = getWrapper(content, expandible);
  const icon = findByTestId(wrapper, accordionIconTestId);
  const accordion = findByTestId(wrapper, accordionTestId);
  icon.simulate('click');
  expect(accordion.prop('onExpandChange')).toBe(undefined);
});
