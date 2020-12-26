import { BaseComponentProps } from 'common/types';

export interface ChipProps extends BaseComponentProps {
  bottomSpacing?: boolean;
  color?:
    | 'blue'
    | 'light-blue'
    | 'error'
    | 'light-gray'
    | 'purple-light'
    | 'blue-fine'
    | 'light-green'
    | 'transparent-grey'
    | 'darker-grey';
  leftSpacing?: boolean;
  rightSpacing?: boolean;
  tooltip?: string;
  topSpacing?: boolean;
}
