import { BaseComponentProps, OnInputChange, OnInputFocus, OnInputBlur, OnInputKeyboard } from 'common/types';

export interface InputProps extends BaseComponentProps {
  autoComplete?: boolean;
  borderBottom?: boolean;
  disabled?: boolean;
  error?: boolean;
  hasDefaultBorder?: boolean;
  max?: number;
  maxLength?: number;
  min?: number;
  minLength?: number;
  name: string;
  onChange?: OnInputChange;
  onBlur?: OnInputBlur;
  onKeyDown?: OnInputKeyboard;
  onFocus?: OnInputFocus;
  onKeyPress?: OnInputKeyboard;
  onKeyUp?: OnInputKeyboard;
  onlyNumber?: boolean;
  onTouched?: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
  placeholder?: string;
  placeholderLeftPadding?: boolean;
  primary?: boolean;
  type?: 'text' | 'password' | 'search';
  value?: string | string[] | number;
  id?: string;
}
