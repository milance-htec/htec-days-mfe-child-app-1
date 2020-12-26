import { BaseComponentProps } from 'common/types';
import { ReactNode } from 'react';

export interface AccordionProps extends BaseComponentProps {
  content: ReactNode;
  expandible: ReactNode;
  onExpandChange?: (prevoiousState: boolean, data?: any) => void;
  value?: any;
  expandiblePadding?: number;
}
