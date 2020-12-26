export function getSearchParameters(urlQueryString: string) {
  return new URLSearchParams(urlQueryString);
}

export function getUrlWithQueryParams(url: string, queryObject: any) {
  const queryParamsAsString = getQueryParamsFromObject(queryObject);

  return `${url}${queryParamsAsString ? `?${queryParamsAsString}` : ''}`;
}

export function getQueryParamsFromObject(queryObject: { [id: string]: string | string[] }) {
  if (!Object.keys(queryObject).length) {
    return '';
  }

  return Object.keys(queryObject)
    .map((key) => {
      if (typeof queryObject[key] === 'object' && queryObject[key].length !== undefined) {
        return (queryObject[key] as string[]).map((arrayValue) => `${key}=${arrayValue}`).join('&');
      }

      return `${key}=${queryObject[key]}`;
    })
    .join('&');
}
