import { BaseComponentProps } from 'common/types';

export interface RadioWithLabelProps extends BaseComponentProps {
  classNameRadio?: string;
  classNameLabel?: string;
  group?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
  label?: string;
  checked: boolean;
  value?: string;
  disabled?: boolean;
}

export interface RadioWithLabelFieldMessage {
  message: string;
  type: RadioWithLabelFieldMessageType;
}

export type RadioWithLabelFieldMessageType = 'error' | 'success';
