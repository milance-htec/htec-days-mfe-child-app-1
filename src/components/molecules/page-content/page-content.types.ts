import { BaseComponentProps } from 'common/types';
import * as CSS from 'csstype';

export interface PageContentProps extends BaseComponentProps {
  scrollable?: boolean;
  padding?: boolean;
  display?: CSS.DisplayProperty;
}
