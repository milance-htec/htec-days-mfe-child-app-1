import React from 'react';
import { cleanup } from '@testing-library/react';
import Flex from '../flex.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'flex-class';
const testStyle = { marginRight: '10px' };
const flexGrowTest = 1;
const flexShrinkTest = 1;
const flexBasisTest = 0;
const flexFlexTest = 1;
const flexAlignItemsTest = 'center';
const flexJustifyContentTest = 'center';
const flexFlexDirectionTest = 'column';
const flexDisplayTest = 'flex';
const flexFlexWrapTest = 'wrap';
const flexLayoutId = 'flex-layout';
const flexItemId = 'flex-item';
const flexLayoutStyle = {
  alignItems: flexAlignItemsTest,
  flexBasis: flexBasisTest,
  flexDirection: flexFlexDirectionTest,
  flexGrow: flexGrowTest,
  flexShrink: flexShrinkTest,
  flexWrap: flexFlexWrapTest,
  justifyContent: flexJustifyContentTest,
  marginRight: '10px',
};
const flexLayoutFlex = {
  alignItems: undefined,
  flex: flexFlexTest,
  flexDirection: flexFlexDirectionTest,
  flexWrap: flexFlexWrapTest,
  justifyContent: flexJustifyContentTest,
  marginRight: '10px',
};
const flexItemFlex = {
  alignItems: undefined,
  flex: flexFlexTest,
  display: flexDisplayTest,
  flexDirection: flexFlexDirectionTest,
  flexWrap: flexFlexWrapTest,
  justifyContent: flexJustifyContentTest,
  minWidth: undefined,
  width: undefined,
  marginRight: '10px',
};

const getWrapper = (isFlex: boolean = true) => {
  const layout = isFlex ? (
    <Flex.Layout
      flexGrow={flexGrowTest}
      flexShrink={flexShrinkTest}
      flexBasis={flexBasisTest}
      className={testClass}
      alignItems={flexAlignItemsTest}
      justifyContent={flexJustifyContentTest}
      flexDirection={flexFlexDirectionTest}
      flexWrap={flexFlexWrapTest}
      style={testStyle}
    >
      <Flex.Item flex={flexFlexTest}></Flex.Item>
    </Flex.Layout>
  ) : (
    <Flex.Layout
      justifyContent={flexJustifyContentTest}
      flexDirection={flexFlexDirectionTest}
      flexWrap={flexFlexWrapTest}
      flex={flexFlexTest}
      className={testClass}
      style={testStyle}
    >
      <Flex.Item
        display={flexDisplayTest}
        flex={flexFlexTest}
        justifyContent={flexJustifyContentTest}
        flexDirection={flexFlexDirectionTest}
        flexWrap={flexFlexWrapTest}
        className={testClass}
        style={testStyle}
      ></Flex.Item>
    </Flex.Layout>
  );
  return mount(layout);
};

it('Renders without crashing', () => {
  const flexLayout = findByTestId(getWrapper(), flexLayoutId);

  expect(flexLayout.hasClass(testClass)).toBeTruthy();
  expect(flexLayout.prop('style')).toEqual(flexLayoutStyle);
});

it('Renders without crashing flex', () => {
  const wrapper = getWrapper(false);
  const flexLayout = findByTestId(wrapper, flexLayoutId);
  const flexItem = findByTestId(wrapper, flexItemId);

  expect(flexItem.hasClass(testClass)).toBeTruthy();
  expect(flexLayout.prop('style')).toEqual(flexLayoutFlex);
  expect(flexItem.prop('style')).toEqual(flexItemFlex);
});
