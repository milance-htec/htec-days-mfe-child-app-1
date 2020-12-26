import React, { ReactNode } from 'react';
import { cleanup } from '@testing-library/react';
import { mount } from 'enzyme';

import { MultiselectAutocomplete, MULTISELECT_AUTOCOMPLETE_TEST_ID } from '../multiselect-autocomplete.component';

import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'organization-module-row-class';
const testStyle = { marginRight: '10px' };
const optionsTest = [{ title: 'Test' }, { title: 'Test1' }];
const defaultValuesTest = [{ title: 'Test' }, { title: 'Test1' }];
const limitTagsTest = 1;
const selectedCountTest = 0;
const onChangeTest = jest.fn((values: any[]) => {});

const getWrapper = (
  options: any[],
  selectedCount: number,
  onChange: (values: any[]) => void,
  defaultValues?: any[],
  getLimitTagsText?: (more: number) => ReactNode,
  limitTags?: number,
) => {
  return mount(
    <MultiselectAutocomplete
      options={options}
      selectedCount={selectedCount}
      onChange={onChange}
      defaultValues={defaultValues}
      getLimitTagsText={getLimitTagsText}
      limitTags={limitTags}
      className={testClass}
      style={testStyle}
    />,
  );
};

it('Renders without crashing', () => {
  const multiselectAutocomplete = findByTestId(
    getWrapper(optionsTest, selectedCountTest, onChangeTest),
    MULTISELECT_AUTOCOMPLETE_TEST_ID,
  );

  expect(multiselectAutocomplete.hasClass(testClass)).toBeTruthy();
  expect(multiselectAutocomplete.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with default values and limit tags', () => {
  const getLimitTagsTextTest = jest.fn((more: number) => <div>{`+ ${more}`}</div>);
  const multiselectAutocomplete = findByTestId(
    getWrapper(optionsTest, selectedCountTest, onChangeTest, defaultValuesTest, getLimitTagsTextTest, limitTagsTest),
    MULTISELECT_AUTOCOMPLETE_TEST_ID,
  );

  expect(multiselectAutocomplete.hasClass(testClass)).toBeTruthy();
  expect(multiselectAutocomplete.prop('style')).toEqual(testStyle);
});
