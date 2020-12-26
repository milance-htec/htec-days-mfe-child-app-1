import { BaseComponentProps } from 'common/types';

export interface ImageProps extends BaseComponentProps<HTMLImageElement> {
  alt?: string;
  src: string;
}
