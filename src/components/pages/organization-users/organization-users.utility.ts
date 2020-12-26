/* Types */
import {
  OrganizationUsersPageQueryParams,
  OrganizationUsersPageSearchTypeQueryParam,
} from './organization-users.types';
import { DropdownOption } from 'components/atoms/dropdown/dropdown.types';

/* Constants */
import {
  ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL,
  ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS,
  ORGANIZATION_USERS_SEARCH_TYPE_VALUES,
  USER_SEARCH_INPUT_MAX_LIMIT,
} from './organization-users.constants';
import { USER_ORDER_BY, USER_STATUSES } from 'common/constants';

/* Utilities */
import { QueryParamItem, SetQueryParamsOptions } from 'common/hooks/useQueryParams';
import { validateDate } from 'common/utility';

export const areQueryParamsValidAndFixOrganizationUsersPageQueryParams = ({
  queryParams,
  paginationPageLimits,
  setQueryParams,
  selectedValues,
}: {
  queryParams: OrganizationUsersPageQueryParams;
  paginationPageLimits: DropdownOption<number>[];
  setQueryParams: (props: SetQueryParamsOptions<OrganizationUsersPageQueryParams>) => void;
  selectedValues: { searchType: OrganizationUsersPageSearchTypeQueryParam };
}): boolean => {
  const queryParamsValidity = isQueryValid(queryParams, paginationPageLimits);
  const isSearchLimitExceeded = !!queryParams.search && queryParams.search.length > USER_SEARCH_INPUT_MAX_LIMIT;
  let clearQueryParams: string[] = [];
  const paramsToSet: QueryParamItem[] = [];

  // Role
  if (!queryParamsValidity.role) {
    clearQueryParams.push(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.ROLE);
  }

  // Status
  if (!queryParamsValidity.status) {
    clearQueryParams.push(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.STATUS);
  }

  // Order by
  if (!queryParamsValidity.orderBy) {
    clearQueryParams.push(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.ORDER_BY);
  }

  // Date range
  if (!queryParamsValidity.dateFromAndTo) {
    clearQueryParams.push(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.DATE_FROM);
    clearQueryParams.push(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.DATE_TO);
  }

  // Pagination page
  if (!queryParamsValidity.page) {
    paramsToSet.push(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE);
  }

  // Pagination size
  if (!queryParamsValidity.size) {
    paramsToSet.push(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SIZE);
  }

  // Search type param
  if (!queryParams.search && queryParams.searchType) {
    clearQueryParams.push(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.SEARCH_TYPE);
  } else if (queryParams.search && !queryParamsValidity.searchType) {
    paramsToSet.push({
      name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.SEARCH_TYPE,
      value: selectedValues.searchType,
    });
  }

  // Search
  if (queryParams.search === '' || isSearchLimitExceeded) {
    // Search query param
    if (!queryParams.search) {
      // If search query param is empty clear it from url
      clearQueryParams.push(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.SEARCH);
    } else if (queryParams.search && queryParams.search.length > USER_SEARCH_INPUT_MAX_LIMIT) {
      // If search query param exceeds limit

      paramsToSet.push({
        name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.SEARCH,
        value: queryParams.search.slice(0, USER_SEARCH_INPUT_MAX_LIMIT),
      });
    }
  }

  if (clearQueryParams.length || paramsToSet.length) {
    setQueryParams({
      clearParams: clearQueryParams,
      operationType: 'replace',
      params: paramsToSet,
    });
    return false;
  }

  return true;
};

const isQueryValid = (
  pageQueryParameters: OrganizationUsersPageQueryParams,
  paginationPageLimits: DropdownOption<number>[],
): {
  page: boolean;
  size: boolean;
  role: boolean;
  status: boolean;
  orderBy: boolean;
  dateFromAndTo: boolean;
  searchType: boolean;
} => {
  const {
    size: sizeParam,
    page: pageParam,
    role: roleParam,
    status: statusParam,
    orderBy: orderByParam,
    dateFrom: dateFromParam,
    dateTo: dateToParam,
    searchType: searchTypeParam,
    search: searchParam,
  } = pageQueryParameters;

  let isSizeParamValid = true;
  let isPageParamValid = true;
  let isRoleParamIntString = true;
  let isStatusParamValid = true;
  let isOrderByParamValid = true;
  let isDateFromAndToParamValid = true;
  let isSearchTypeParamValid = true;

  // Pagination size
  if (sizeParam !== null && typeof sizeParam === 'string') {
    isSizeParamValid = !!paginationPageLimits.find((limitElement) => {
      return limitElement.value === parseInt(sizeParam, 10);
    });
  } else if (!sizeParam) {
    isSizeParamValid = false;
  }

  // Pagination page
  if (pageParam !== null && typeof pageParam === 'string') {
    const parsedPageParam = parseInt(pageParam);
    isPageParamValid = !isNaN(Number(pageParam)) && parsedPageParam >= 0;
  } else if (!pageParam) {
    isPageParamValid = false;
  }

  // Role
  if (roleParam !== null && (typeof roleParam === 'string' || Array.isArray(roleParam))) {
    if (Array.isArray(roleParam)) {
      if (roleParam.filter((role) => isNaN(Number(role))).length) {
        isRoleParamIntString = false;
      }
    } else {
      isRoleParamIntString = !isNaN(Number(roleParam));
    }
  }

  // Status
  if (statusParam !== null && (typeof statusParam === 'string' || Array.isArray(statusParam))) {
    if (Array.isArray(statusParam)) {
      if (statusParam.filter((status) => !Object.keys(USER_STATUSES).includes(status)).length) {
        isStatusParamValid = false;
      }
    } else {
      isStatusParamValid = Object.keys(USER_STATUSES).includes(statusParam.toUpperCase());
    }
  }

  // Ordey by
  if (orderByParam !== null && typeof orderByParam === 'string') {
    isOrderByParamValid = Object.keys(USER_ORDER_BY).includes(orderByParam);
  }

  // Date range
  if (
    dateFromParam !== null &&
    dateToParam !== null &&
    typeof dateFromParam === 'string' &&
    typeof dateToParam === 'string'
  ) {
    isDateFromAndToParamValid = validateDate(dateFromParam) && validateDate(dateToParam);
  }

  // Search type
  if (
    searchParam &&
    searchTypeParam !== ORGANIZATION_USERS_SEARCH_TYPE_VALUES.EMAIL &&
    searchTypeParam !== ORGANIZATION_USERS_SEARCH_TYPE_VALUES.NAME
  ) {
    isSearchTypeParamValid = false;
  }

  return {
    size: !!isSizeParamValid,
    page: !!isPageParamValid,
    role: isRoleParamIntString,
    status: isStatusParamValid,
    orderBy: isOrderByParamValid,
    dateFromAndTo: isDateFromAndToParamValid,
    searchType: isSearchTypeParamValid,
  };
};
