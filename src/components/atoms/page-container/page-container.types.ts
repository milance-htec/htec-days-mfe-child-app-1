import { BaseComponentProps } from 'common/types';

export interface PageContainerProps extends BaseComponentProps {
  scrollable?: boolean;
  flex?: boolean;
  flexDirection?: 'row' | 'column';
}
