/* Types */
import { RolesPageQueryParams } from './roles.types';
import { DropdownOption } from 'components/atoms/dropdown/dropdown.types';

/* Constants */
import {
  ROLES_PAGE_VIEW_VALUES,
  ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL,
  ROLES_PAGE_QUERY_PARAMS_KEYS,
  ROLES_SEARCH_INPUT_MAX_LIMIT,
} from './roles.constants';

/* Utilities */
import { SetQueryParamsOptions, QueryParamItem } from 'common/hooks/useQueryParams';

export const areQueryParamsValidAndFixRolesPageQueryParams = ({
  queryParams,
  paginationPageLimits,
  setQueryParams,
}: {
  queryParams: RolesPageQueryParams;
  paginationPageLimits: DropdownOption<number>[];
  setQueryParams: (props: SetQueryParamsOptions<RolesPageQueryParams>) => void;
}): boolean => {
  const queryParamsValidity = isQueryValid(queryParams, paginationPageLimits);

  const isListViewActiveAndPageOrSizeInvalid =
    queryParams.view === ROLES_PAGE_VIEW_VALUES.LIST && (!queryParamsValidity.page || !queryParamsValidity.size);
  const isTilesViewActiveAndPageOrSizePresent =
    queryParams.view === ROLES_PAGE_VIEW_VALUES.TILES && (!!queryParams.page || !!queryParams.size);
  const isSearchLimitExceeded = !!queryParams.search && queryParams.search.length > ROLES_SEARCH_INPUT_MAX_LIMIT;

  if (
    isListViewActiveAndPageOrSizeInvalid ||
    isTilesViewActiveAndPageOrSizePresent ||
    queryParams.search === '' ||
    !queryParamsValidity.view ||
    !queryParams.view ||
    isSearchLimitExceeded
  ) {
    let clearQueryParams: string[] = [];
    const paramsToSet: QueryParamItem[] = [];

    // Resolving page and size query params
    if (isListViewActiveAndPageOrSizeInvalid) {
      // Params invalid

      if (!queryParamsValidity.page) {
        paramsToSet.push(ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE);
      }

      if (!queryParamsValidity.size) {
        paramsToSet.push(ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SIZE);
      }
    } else if (isTilesViewActiveAndPageOrSizePresent) {
      // Clear page and size query params if tiles view is active
      clearQueryParams = clearQueryParams.concat([
        ROLES_PAGE_QUERY_PARAMS_KEYS.PAGE,
        ROLES_PAGE_QUERY_PARAMS_KEYS.SIZE,
      ]);
    }

    // Search query param
    if (queryParams.search === '') {
      // If search query param is empty clear it from url
      clearQueryParams.push(ROLES_PAGE_QUERY_PARAMS_KEYS.SEARCH);
    } else if (queryParams.search && queryParams.search.length > ROLES_SEARCH_INPUT_MAX_LIMIT) {
      // If search query param exceeds limit

      paramsToSet.push({
        name: ROLES_PAGE_QUERY_PARAMS_KEYS.SEARCH,
        value: queryParams.search.slice(0, ROLES_SEARCH_INPUT_MAX_LIMIT),
      });
    }

    // View query param
    if (!queryParams.view || !queryParamsValidity.view) {
      paramsToSet.push(ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL.VIEW);
    }

    if (clearQueryParams.length || paramsToSet.length) {
      setQueryParams({
        clearParams: clearQueryParams,
        operationType: 'replace',
        params: paramsToSet,
      });

      return false;
    } else {
      return true;
    }
  }

  return true;
};

const isQueryValid = (
  pageQueryParameters: RolesPageQueryParams,
  paginationPageLimits: DropdownOption<number>[],
): { page: boolean; size: boolean; view: boolean } => {
  const sizeParam = pageQueryParameters.size;
  const pageParam = pageQueryParameters.page;
  const viewParam = pageQueryParameters.view;

  let isSizeParamInBounds;
  let isPageParamNumberAndNotNegative;
  let isViewParamValid = true;

  if (sizeParam !== null && typeof sizeParam === 'string') {
    isSizeParamInBounds = paginationPageLimits.find((limitElement) => {
      return limitElement.value === parseInt(sizeParam, 10);
    });
  }

  if (pageParam !== null && typeof pageParam === 'string') {
    const parsedPageParam = parseInt(pageParam);
    isPageParamNumberAndNotNegative = !isNaN(Number(pageParam)) && parsedPageParam >= 0;
  }

  if (viewParam !== 'list' && viewParam !== 'tiles') {
    isViewParamValid = false;
  }

  return {
    size: !!isSizeParamInBounds,
    page: !!isPageParamNumberAndNotNegative,
    view: isViewParamValid,
  };
};
