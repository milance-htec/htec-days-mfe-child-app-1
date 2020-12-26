import { BaseComponentProps } from 'common/types';
import {
  AlignSelfProperty,
  DisplayProperty,
  FlexBasisProperty,
  FlexDirectionProperty,
  FlexProperty,
  FlexWrapProperty,
  Globals,
  GlobalsNumber,
  JustifyContentProperty,
  SelfPosition,
} from 'csstype';

export interface LayoutProps extends BaseComponentProps, FlexElementProps {
  tooltip?: string;
  width?: string;
}

export interface ItemProps extends BaseComponentProps, FlexElementProps {
  horizontalSpacing?: boolean;
  display?: DisplayProperty;
  width?: string;
}

export interface FlexElementProps {
  alignAll?: (JustifyContentProperty & Globals) | SelfPosition | 'baseline' | 'normal' | 'stretch';
  alignItems?: Globals | SelfPosition | 'baseline' | 'normal' | 'stretch';
  flex?: FlexProperty<number | string>;
  flexDirection?: FlexDirectionProperty;
  flexGrow?: GlobalsNumber;
  flexShrink?: GlobalsNumber;
  flexBasis?: FlexBasisProperty<string | 0>;
  flexWrap?: FlexWrapProperty;
  justifyContent?: JustifyContentProperty;
  alignSelf?: AlignSelfProperty;
}
