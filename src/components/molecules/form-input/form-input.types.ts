import { CSSProperties } from 'react';

import { InputProps } from 'components/atoms/input/input.types';

export interface FormInputProps extends InputProps {
  bottomSpacing?: boolean;
  changed?: boolean;
  defaultMessage?: FormInputMessage;
  detectCapsLock?: boolean;
  hasDebounce?: boolean;
  hideTitle?: boolean;
  id?: string;
  inputClassName?: string;
  inputStyle?: CSSProperties;
  message?: FormInputMessage;
  searchIconOnClick?: () => void;
  showInputMessage?: boolean;
  showPasswordIcon?: boolean;
  showTitleAlways?: boolean;
  title?: string;
  topSpacing?: boolean;
}

export interface FormInputMessage {
  message: string;
  type?: FormInputMessageType;
}

export type FormInputMessageType = 'default' | 'error' | 'success';
