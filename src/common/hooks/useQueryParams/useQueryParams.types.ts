export type SetQueryParamsOptions<Q = BaseQueryParameters> = {
  params?: QueryParamItem<Q>[];
  clearParams?: keyof Q | (keyof Q)[];
  operationType?: 'push' | 'replace';
  baseRoute?: string;
  clearAllParams?: boolean;
};

export type QueryParamItem<Q = BaseQueryParameters> = {
  name?: keyof Q;
  value?: string | string[] | null;
};

export interface BaseQueryParameters {
  [key: string]: string | string[] | null;
}
