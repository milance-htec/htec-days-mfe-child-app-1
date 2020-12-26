import React from 'react';
import { cleanup } from '@testing-library/react';
import { Table } from '../table.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

import { TableColumn, TableColumnRenderElement } from '../table.types';

afterEach(cleanup);

const testClass = 'table-class';
const testStyle = { marginRight: '10px' };
const testRenderFunction: TableColumnRenderElement<number> = ({ data, index }) => {
  return <div>{`data: ${data} index: ${index}`}</div>;
};
const renderCollapsibleFunction: TableColumnRenderElement<number> = ({ data, index }) => {
  return <div>{`data: ${data} index: ${index}`}</div>;
};
const sortColumnTest = jest.fn(() => {});
const tableColumnsTest: TableColumn[] = [
  {
    title: 'Name',
    titleTextAlign: 'left',
    renderElement: testRenderFunction,
    columnAlignContent: 'flex-start',
    sortable: true,
    sortColumn: sortColumnTest,
  },
];
const tableRowsTest = [1];
const tableTestId = 'table';
const tableExpandingRowIconTestId = 'table-expanding-row-icon';
const tableSortIconTestId = 'table-sort-icon';

const getWrapper = (columns: TableColumn[], rows: any[], collapsibleRendered?: TableColumnRenderElement) => {
  return mount(
    <Table
      columns={columns}
      rows={rows}
      collapsibleRendered={collapsibleRendered}
      className={testClass}
      style={testStyle}
    />,
  );
};

it('Renders without crashing', () => {
  const table = findByTestId(getWrapper(tableColumnsTest, tableRowsTest), tableTestId);

  expect(table.hasClass(testClass)).toBeTruthy();
  expect(table.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with exbandible rows', () => {
  const table = findByTestId(getWrapper(tableColumnsTest, tableRowsTest, renderCollapsibleFunction), tableTestId);

  expect(table.hasClass(testClass)).toBeTruthy();
  expect(table.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with exbandible rows with expand', () => {
  const tableExpandingRowIcon = findByTestId(
    getWrapper(tableColumnsTest, tableRowsTest, renderCollapsibleFunction),
    tableExpandingRowIconTestId,
  );
  tableExpandingRowIcon.simulate('click');
});

it('Renders without crashing with sort column', () => {
  const tableSortIcon = findByTestId(
    getWrapper(tableColumnsTest, tableRowsTest, renderCollapsibleFunction),
    tableSortIconTestId,
  );
  tableSortIcon.simulate('click');
  expect(sortColumnTest).toBeCalled();
});
