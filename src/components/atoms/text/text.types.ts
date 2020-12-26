import { BaseComponentProps } from 'common/types';

export interface TextProps extends BaseComponentProps<HTMLSpanElement> {
  bold?: boolean;
  color?: 'normal' | 'primary' | 'secondary1' | 'secondary2' | 'link';
  underline?: boolean;
}
