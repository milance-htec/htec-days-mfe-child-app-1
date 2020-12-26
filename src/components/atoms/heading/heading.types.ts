import { BaseComponentProps } from 'common/types';
import * as CSS from 'csstype';

export interface HeadingProps extends BaseComponentProps<HTMLHeadingElement> {
  type?: 1 | 2 | 3 | 4 | 5 | 6;
  textAlign?: CSS.TextAlignProperty;
  bottomSpacing?: boolean;
  textColor?: 'blue' | 'white';
}
