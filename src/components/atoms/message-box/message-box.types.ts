import { BaseComponentProps } from 'common/types';

export interface MessageBoxProps extends BaseComponentProps {
  type?: 'info' | 'error' | 'success';
}
