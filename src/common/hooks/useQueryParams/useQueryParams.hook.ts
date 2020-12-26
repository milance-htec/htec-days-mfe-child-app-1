import { getUrlWithQueryParams } from 'common/http';
import { isArray } from 'lodash';
import { useHistory } from 'react-router-dom';

import { BaseQueryParameters, SetQueryParamsOptions } from './useQueryParams.types';

export function useQueryParams<Q = BaseQueryParameters>(options: {
  baseUrlPredefined: string;
  queryParamKeys: string[];
}) {
  const { baseUrlPredefined, queryParamKeys } = options;

  const history = useHistory<Q>();

  const urlSearchParams = new URLSearchParams(history.location.search);

  const queryParams: Q = queryParamKeys.reduce((accumulator, currentValue) => {
    const extractedQueryValues = urlSearchParams.getAll(currentValue);

    if (extractedQueryValues.length === 0) {
      // @ts-ignore
      accumulator[currentValue] = null;
    } else {
      // @ts-ignore
      accumulator[currentValue] = extractedQueryValues.length === 1 ? extractedQueryValues[0] : extractedQueryValues;
    }

    return accumulator;
  }, {} as Q);

  return {
    queryParams,
    setQueryParams: (props: SetQueryParamsOptions<Q>) => {
      const { params, clearParams = null, baseRoute, clearAllParams = false, operationType = 'push' } = props;

      const locationUrl = baseRoute || baseUrlPredefined;

      let queryParamsForUse = queryParams;

      if (clearAllParams) {
        if (!params || !params.length) {
          // Clear all params
          if (locationUrl) {
            if (operationType === 'push') {
              history.push(locationUrl);
            } else if (operationType === 'replace') {
              history.replace(locationUrl);
            }
          }
          return;
        } else {
          // Clear all params and add new ones
          queryParamsForUse = {} as Q;
        }
      }

      // Get initial query params values
      const queryParamsForRoute = (Object.keys(queryParamsForUse) as (keyof Q)[]).reduce((accumulator, queryKey) => {
        if (queryParamsForUse[queryKey]) {
          if (isArray(queryParamsForUse[queryKey])) {
            // @ts-ignore
            accumulator[queryKey] = (queryParamsForUse[queryKey] as string[]).map((param) => encodeURIComponent(param));
          } else {
            // @ts-ignore
            accumulator[queryKey] = encodeURIComponent(queryParamsForUse[queryKey] as string);
          }
        }

        return accumulator;
      }, {} as Partial<Q>);

      // Clear parameters if provided
      if (clearParams) {
        if (typeof clearParams === 'string' && queryParamsForRoute[clearParams]) {
          delete queryParamsForRoute[clearParams];
        } else if (typeof clearParams === 'object' && clearParams.length !== undefined) {
          clearParams.forEach((queryKey) => {
            if (queryParamsForRoute[queryKey]) {
              delete queryParamsForRoute[queryKey];
            }
          });
        }
      }

      // Set value for given parameter
      if (params?.length) {
        params.forEach((paramItem) => {
          if (paramItem.name !== undefined && paramItem.value !== undefined) {
            if (paramItem.value === '' || paramItem.value === null) {
              // If value is empty remove query param
              delete queryParamsForRoute[paramItem.name];
            } else {
              // @ts-ignore
              queryParamsForRoute[paramItem.name] = Array.isArray(paramItem.value)
                ? paramItem.value.map((param) => encodeURIComponent(param))
                : encodeURIComponent(paramItem.value);
            }
          }
        });
      }

      if (locationUrl) {
        if (operationType === 'push') {
          history.push(getUrlWithQueryParams(locationUrl, queryParamsForRoute));
        } else {
          history.replace(getUrlWithQueryParams(locationUrl, queryParamsForRoute));
        }
      } else {
        console.error('Set query parameters needs at least baseUrlPredefined or baseRoute');
      }
    },
  };
}
