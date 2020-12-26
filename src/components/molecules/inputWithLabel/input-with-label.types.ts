import { BaseComponentProps, OnInputChange } from 'common/types';

export interface InputWithLabelProps extends BaseComponentProps {
  classNameInput?: string;
  classNameLabel?: string;
  inputAudoComplete?: boolean;
  inputDisabled?: boolean;
  inputMax?: number;
  inputMaxLength?: number;
  inputMin?: number;
  inputMinLength?: number;
  message?: InputWithLabelFieldMessage;
  name?: string;
  placeholder?: string;
  type?: 'text' | 'password';
  value?: string;
  onChange?: OnInputChange;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onTouched?: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
}

export interface InputWithLabelFieldMessage {
  message: string;
  type?: InputWithLabelFieldMessageType;
}

export type InputWithLabelFieldMessageType = 'error' | 'success';
