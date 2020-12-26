import React, { useState, FunctionComponent } from 'react';
import classnames from 'classnames';
import { ArrowDropDown, KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

/* Components */
import { Icon, Dropdown } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { PaginationProps } from './pagination.types';

/* Styles */
import './pagination.scss';

export const Pagination: FunctionComponent<PaginationProps> = ({
  className,
  style,
  currentPage,
  totalPages,
  totalCount,
  pageLimit,
  pageLimitOptions,
  previousPage,
  nextPage,
}) => {
  let itemsPerPage = pageLimit;
  const [dropdownState, setDropdownState] = useState(false);

  const onDropdownClick = (dropdownStatus: any) => () => {
    setDropdownState(!dropdownStatus);
  };

  const maxCount = totalPages === currentPage ? totalCount : currentPage * pageLimit;

  return (
    <Flex.Layout
      data-testid="pagination"
      className={classnames('pagination', className)}
      justifyContent="flex-end"
      alignItems="center"
      style={style}
    >
      Rows per page : {itemsPerPage}
      <Dropdown
        direction="up"
        options={pageLimitOptions}
        onDropdownHide={onDropdownClick(dropdownState)}
        showDropdown={dropdownState}
      />
      <Icon
        data-testid="pagination-dropdown-icon"
        onClick={onDropdownClick(dropdownState)}
        qaName="paginationDropDownArrow"
      >
        <ArrowDropDown />
      </Icon>
      <span className="items-counter">
        {pageLimit * (currentPage - 1) + 1}-{maxCount} of {totalCount}
      </span>
      {currentPage - 1 > 0 ? (
        <Icon onClick={previousPage} qaName="paginationPreviousPageArrow">
          <KeyboardArrowLeft />
        </Icon>
      ) : (
        <Icon className="action-disabled">
          <KeyboardArrowLeft />
        </Icon>
      )}
      {maxCount !== totalCount ? (
        <Icon onClick={nextPage} qaName="paginationNextPageArrow">
          <KeyboardArrowRight />
        </Icon>
      ) : (
        <Icon className="action-disabled">
          <KeyboardArrowRight />
        </Icon>
      )}
    </Flex.Layout>
  );
};
