import { BaseComponentProps } from 'common/types';

export interface LoaderProps extends BaseComponentProps<HTMLElement> {
  loaderFlag: boolean;
  noBackground?: boolean;
  backgroundOpacityPointVariant?: number;
}
