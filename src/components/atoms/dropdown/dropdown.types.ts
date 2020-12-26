import { BaseComponentProps } from 'common/types';

export interface DropdownProps extends BaseComponentProps<HTMLElement> {
  direction?: 'up' | 'down';
  options?: DropdownOption[];
  showDropdown: boolean;
  title?: string;
  onDropdownHide?: () => void;
  footerOptions?: DropdownOption[];
}

export type DropdownOptionAction<V = any> = (optionValue: V) => void;

export type DropdownOption<V = any> = {
  action?: DropdownOptionAction<V>;
  name: string;
  value?: V;
};
