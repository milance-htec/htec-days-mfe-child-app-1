import { BaseComponentProps } from 'common/types';

export interface InputSelectProps extends BaseComponentProps {
  clearValueIcon?: boolean;
  currentPage?: number;
  onInputChange?: (value: string) => void;
  onListEnd?: () => void;
  onOptionSelect: (option: InputSelectOption | null) => void;
  options: InputSelectOption[];
  optionsLoading?: boolean;
  placeholder?: string;
  title?: string;
  totalPages?: number;
  type?: 'input' | 'select';
  unselectElement?: boolean;
  unselectElementTitle?: string;
  value?: string;
}

export interface InputSelectOption<D = any> {
  title: string;
  value: D;
}

export interface OptionListProps extends BaseComponentProps {
  currentPage?: number;
  listOptionsRef?: any;
  onInputOptionClick: (selectedOption: InputSelectOption, index: number) => () => void;
  onListBlur: () => void;
  options: InputSelectOption[];
  optionsLoading?: boolean;
  totalPages?: number;
}
