import { ConsumersPageQueryParams, ConsumersPageSearchTypeQueryParam } from './consumers.types';
import { QueryParamItem, SetQueryParamsOptions } from 'common/hooks/useQueryParams';
import { FormInputMessage } from 'components/molecules/form-input/form-input.types';
import {
  CONSUMERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL,
  CONSUMERS_PAGE_QUERY_PARAMS_KEYS,
  CONSUMERS_PAGE_REGION_QUERY_PARAM_VALUES,
  CONSUMERS_SEARCH_INPUT_MAX_LIMIT,
} from './consumers.constants';

/* Query params validation */
export const areQueryParamsValidAndFixConsumersPageQueryParams = ({
  queryParams,
  setQueryParams,
}: {
  queryParams: ConsumersPageQueryParams;
  setQueryParams: (props: SetQueryParamsOptions<ConsumersPageQueryParams>) => void;
}): boolean => {
  const queryParamsValidity = isQueryValid(queryParams);
  const isSearchLimitExceeded = !!queryParams.search && queryParams.search.length > CONSUMERS_SEARCH_INPUT_MAX_LIMIT;
  let clearQueryParams: string[] = [];
  const paramsToSet: QueryParamItem[] = [];

  // Search type param
  if (!queryParamsValidity.searchType) {
    paramsToSet.push(CONSUMERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SEARCH_TYPE);
  }

  // Search type param
  if (!queryParamsValidity.isRegionParamValid) {
    paramsToSet.push(CONSUMERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.REGION);
  }

  // Search
  if (queryParams.search === '' || isSearchLimitExceeded) {
    // Search query param
    if (!queryParams.search) {
      // If search query param is empty clear it from url
      clearQueryParams.push(CONSUMERS_PAGE_QUERY_PARAMS_KEYS.SEARCH);
    } else if (queryParams.search && queryParams.search.length > CONSUMERS_SEARCH_INPUT_MAX_LIMIT) {
      // If search query param exceeds limit

      paramsToSet.push({
        name: CONSUMERS_PAGE_QUERY_PARAMS_KEYS.SEARCH,
        value: queryParams.search.slice(0, CONSUMERS_SEARCH_INPUT_MAX_LIMIT),
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
  pageQueryParameters: ConsumersPageQueryParams,
): {
  searchType: boolean;
  isRegionParamValid: boolean;
} => {
  const { searchType, region } = pageQueryParameters;

  let isSearchTypeParamValid = true;
  let isRegionParamValid = true;

  // Search type
  if (searchType !== 'email' && searchType !== 'phone') {
    isSearchTypeParamValid = false;
  }

  // Region
  if (
    region !== CONSUMERS_PAGE_REGION_QUERY_PARAM_VALUES.CA &&
    region !== CONSUMERS_PAGE_REGION_QUERY_PARAM_VALUES.US
  ) {
    isRegionParamValid = false;
  }

  return {
    searchType: isSearchTypeParamValid,
    isRegionParamValid,
  };
};

/* Other */
export function getDefaultSearchFieldMessageConsumersPage(
  value: ConsumersPageSearchTypeQueryParam,
): FormInputMessage | undefined {
  if (value === 'phone') {
    return {
      type: 'default',
      message: 'Phone can be only numbers',
    };
  }
}

export function getSearchFieldMessageConsumersPage({
  searchType,
  isSearchFieldValid,
  showSearchValidationMessage,
}: {
  searchType: ConsumersPageSearchTypeQueryParam;
  isSearchFieldValid: boolean;
  showSearchValidationMessage: boolean;
}): FormInputMessage | undefined {
  if (!isSearchFieldValid && showSearchValidationMessage) {
    if (searchType === 'email') {
      return {
        type: 'error',
        message: 'Invalid email format',
      };
    }
  }
}
