import React from 'react';
import { cleanup } from '@testing-library/react';
import { Pagination } from '../pagination.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';
import { DropdownOption } from 'components/atoms/dropdown/dropdown.types';

afterEach(cleanup);

const testClass = 'pagination-class';
const testStyle = { marginRight: '10px' };
const defaultCurrentPageTest = 1;
const defaultTotalPagesTest = 1;
const defaultTotalCountTest = 5;
const defaultPageLimitTest = 5;
const defaultPageLimitOptionsTest: DropdownOption<any>[] = [
  {
    value: 1,
    name: '1',
    action: () => {},
  },
  {
    value: 2,
    name: '2',
    action: () => {},
  },
  {
    value: 5,
    name: '4',
    action: () => {},
  },
];
const paginationTestId = 'pagination';
const paginationDropdownTestId = 'pagination-dropdown-icon';
const paginationDropdownIconTestId = 'icon';

const getWrapper = (
  currentPage: number,
  totalPages: number,
  totalCount: number,
  pageLimit: number,
  pageLimitOptions: DropdownOption<any>[],
) => {
  return mount(
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      pageLimit={pageLimit}
      pageLimitOptions={pageLimitOptions}
      className={testClass}
      style={testStyle}
    />,
  );
};

it('Renders without crashing', () => {
  const pagination = findByTestId(
    getWrapper(
      defaultCurrentPageTest,
      defaultTotalPagesTest,
      defaultTotalCountTest,
      defaultPageLimitTest,
      defaultPageLimitOptionsTest,
    ),
    paginationTestId,
  );

  expect(pagination.hasClass(testClass)).toBeTruthy();
  expect(pagination.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with dropdown hide', () => {
  const paginationDropdown = findByTestId(
    getWrapper(
      defaultCurrentPageTest,
      defaultTotalPagesTest,
      defaultTotalCountTest,
      defaultPageLimitTest,
      defaultPageLimitOptionsTest,
    ),
    paginationDropdownTestId,
  );
  const paginationDropdownIcon = findByTestId(paginationDropdown, paginationDropdownIconTestId);
  paginationDropdownIcon.simulate('click');
});
