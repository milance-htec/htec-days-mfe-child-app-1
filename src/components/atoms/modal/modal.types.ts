import { BaseComponentProps } from 'common/types';
import { ReactNode } from 'react';

export interface ModalProps extends BaseComponentProps<HTMLElement> {
  closeButtonIcon?: boolean;
  closeButtonIconDisabled?: boolean;
  contentClassName?: string;
  fixedHeight?: boolean;
  footer?: ReactNode;
  headerCustomContent?: any;
  heading?: string;
  nonTransparentBackground?: boolean;
  onModalBlur?: () => void;
  showModal: boolean;
}
