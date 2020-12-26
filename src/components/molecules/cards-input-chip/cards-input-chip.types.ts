import { BaseComponentProps } from 'common/types';

export interface CardsInputChipProps extends BaseComponentProps {
  avatarTitle?: string;
  avatarImage?: string;
  onRemoveClick?: () => void;
  tooltip?: string;
  type?: 'error' | 'blue' | 'light-blue';
}
