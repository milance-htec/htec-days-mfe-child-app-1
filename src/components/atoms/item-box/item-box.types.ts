import { BaseComponentProps } from 'common/types';

export interface ItemBoxProps extends BaseComponentProps {
  isActive?: boolean;
  onActiveChange: (isActive: boolean) => void;
}
