import { BaseComponentProps } from 'common/types';
import { Globals, SelfPosition } from 'csstype';

export interface PageFiltersProps extends BaseComponentProps {
  alignItems?: Globals | SelfPosition | 'baseline' | 'normal' | 'stretch';
}
