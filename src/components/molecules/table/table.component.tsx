import React, { useState, useEffect, FunctionComponent } from 'react';
import classnames from 'classnames';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';

/* Material-Ui */
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

/* Components */
import { Icon, Text } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { TableProps, TableRowProps, CollapsibleRowProps, CollapsibleRowIconProps } from './table.types';

/* Styles */
import './table.scss';

export const Table: FunctionComponent<TableProps> = ({
  columns = [],
  rows = [],
  collapsibleRendered,
  noHeader = false,
  className,
  style,
}) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [sortedColumn, setSortedColumn] = useState(-1);
  const [sortedDirections, setSortedDirections] = useState(columns.map(() => false));

  const expandedHandler = (index: number) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  const onColumnSort = (index: number) => {
    if (sortedColumn !== index) {
      setSortedColumn(index);
    }
    const column = columns[index];
    if (column.sortColumn) {
      column.sortColumn(!sortedDirections[index]);
    }
    const newSortedDirections = [...sortedDirections];
    newSortedDirections[index] = !newSortedDirections[index];
    setSortedDirections(newSortedDirections);
  };

  useEffect(() => {
    if (rows) {
      setExpandedIndex(-1);
    }
  }, [rows]);

  return columns ? (
    <div data-testid="table" className={classnames('table', className)} style={style}>
      <table className="table-container">
        {!noHeader ? (
          <thead>
            <tr>
              {columns.map((column, index) => {
                return (
                  <th key={index} colSpan={column.columnSpan ? column.columnSpan : 1}>
                    <Flex.Layout
                      className="column-header"
                      justifyContent={column.titleTextAlign || 'center'}
                      alignItems="center"
                    >
                      <>
                        <Text bold color="secondary1" className="column-header--title">
                          {column.title}
                        </Text>
                        {column.sortable ? (
                          <Flex.Layout
                            className="column-header__icon-wrapper"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Icon
                              data-testid="table-sort-icon"
                              className={classnames('column-header__icon', {
                                'column-header__icon--active': sortedColumn === index,
                              })}
                              onClick={() => onColumnSort(index)}
                            >
                              {sortedDirections[index] ? (
                                <ArrowUpwardIcon fontSize="small" />
                              ) : (
                                <ArrowDownwardIcon fontSize="small" />
                              )}
                            </Icon>
                          </Flex.Layout>
                        ) : null}
                      </>
                    </Flex.Layout>
                  </th>
                );
              })}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, index) => {
            return (
              <TableRow
                key={index}
                rowIndex={index}
                rowData={row}
                columnRenderers={columns.map((column) => column.renderElement)}
                columnOptions={columns.map((column) => {
                  return {
                    justifyContent: column.columnAlignContent ? column.columnAlignContent : 'center',
                  };
                })}
                columnClassName={columns.map((column) => column.className)}
                collapsibleRendered={collapsibleRendered}
                isExpanded={index === expandedIndex}
                expandedHandler={expandedHandler}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  ) : null;
};

const CollapsibleRowIcon: FunctionComponent<CollapsibleRowIconProps> = ({ expandedHandler, isExpanded, index }) => {
  return (
    <Icon data-testid="table-expanding-row-icon" className="expanding-row-icon" onClick={() => expandedHandler(index)}>
      {isExpanded ? <ArrowDropUp /> : <ArrowDropDown />}
    </Icon>
  );
};

const CollapsibleRow: FunctionComponent<CollapsibleRowProps> = ({ collapsibleRendered, data, isExpanded, index }) => {
  return (
    <tr className="expanding-row">
      <td colSpan={4} className="expanding-row__collapsible">
        <Flex.Layout
          className={classnames('expanding-row__container', {
            'expanding-row__container--show': isExpanded,
          })}
        >
          {collapsibleRendered({ data, index })}
        </Flex.Layout>
      </td>
    </tr>
  );
};

const TableRow: FunctionComponent<TableRowProps> = ({
  collapsibleRendered,
  columnClassName,
  columnOptions,
  columnRenderers,
  expandedHandler,
  isExpanded,
  rowData,
  rowIndex,
}) => {
  return (
    <>
      <tr>
        {columnRenderers.map((columnRenderer, index) => {
          return (
            <td key={index}>
              <Flex.Layout
                alignItems="center"
                justifyContent={columnOptions[index].justifyContent}
                className={columnClassName[index]}
              >
                {!index && collapsibleRendered ? (
                  <CollapsibleRowIcon expandedHandler={expandedHandler} isExpanded={isExpanded} index={rowIndex} />
                ) : null}
                {columnRenderer({ data: rowData, index: rowIndex })}
              </Flex.Layout>
            </td>
          );
        })}
      </tr>
      {collapsibleRendered ? (
        <CollapsibleRow
          collapsibleRendered={collapsibleRendered}
          data={rowData}
          isExpanded={isExpanded}
          index={rowIndex}
        />
      ) : null}
    </>
  );
};
