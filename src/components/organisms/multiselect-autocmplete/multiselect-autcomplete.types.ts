import { BaseComponentProps } from 'common/types';
import { ReactNode } from 'react';

export interface MultiselectAutocompleteProps extends BaseComponentProps {
  defaultValues?: any[];
  disableCloseOnSelect?: boolean;
  getLimitTagsText?: (more: number) => ReactNode;
  helperText?: string;
  inputFieldQaName?: string;
  label?: string;
  limitTags?: number;
  onChange: (event: any, value: any) => void;
  onClose?: (event: any, reason: string) => void;
  optionLabel?: string;
  optionQaName?: string;
  options: any[];
  placeholder?: string;
  popupIconQaName?: string;
  renderInput?: (params: any) => ReactNode;
  renderOption?: (option: any, state: object) => ReactNode;
  renderTags?: (value: any[], getTagProps: (params: any) => any) => ReactNode;
  selectedCount: number;
  size?: 'small' | 'medium';
  value?: any[];
}

export interface OptionState {
  selected: boolean;
  inputValue: string;
}
