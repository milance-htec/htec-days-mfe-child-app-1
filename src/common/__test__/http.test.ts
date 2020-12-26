import { getQueryParamsFromObject, getSearchParameters, getUrlWithQueryParams } from './../http';

describe('getSearchParameters ', () => {
  it('Should yield expected object from provided query parameters', () => {
    const url = 'http://dummy.com?test=123';
    Object.defineProperty(window, 'location', {
      value: new URL(url),
    });

    const searchQueryParamsInstance = getSearchParameters(window.location.search);
    const searchQueryParamsObject = {
      test: searchQueryParamsInstance.get('test'),
      none: searchQueryParamsInstance.get('none'),
    };

    expect(searchQueryParamsObject).toMatchObject({
      test: '123',
      none: null,
    });
  });
});

describe('getQueryParamsFromObject', () => {
  it('Should give query string from query params object', () => {
    const queryParamsFromObject = getQueryParamsFromObject({
      test: '123',
    });

    expect(queryParamsFromObject).toBe('test=123');
  });

  it('Should give query string from query params object when property has array of values', () => {
    const test = 'test';
    const multipleValues = 'multipleValues';

    const queryParamsFromObject = getQueryParamsFromObject({
      [test]: '123',
      [multipleValues]: ['1', '2'],
    });

    expect(queryParamsFromObject).toBe(`${test}=123&${multipleValues}=1&${multipleValues}=2`);
  });

  it('Should give empty string if empty object is provided', () => {
    const queryParamsFromObject = getQueryParamsFromObject({});

    expect(queryParamsFromObject).toBe('');
  });
});

describe('getUrlWithQueryParams', () => {
  it('Should compose whole url with route and query params provided', () => {
    const generatedUrl = getUrlWithQueryParams('www.test.com', {
      test: 123,
    });

    expect(generatedUrl).toBe('www.test.com?test=123');
  });

  it('Should return empty string if empty url and empty object is provided', () => {
    const generatedUrl = getUrlWithQueryParams('', {});

    expect(generatedUrl).toBe('');
  });
});
