import { BaseComponentProps } from 'common/types';

export interface ParagraphProps extends BaseComponentProps<HTMLParagraphElement> {
  size?: 1 | 2 | 3 | 4 | 5;
  color?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justified';
  bottomSpacing?: boolean;
}
