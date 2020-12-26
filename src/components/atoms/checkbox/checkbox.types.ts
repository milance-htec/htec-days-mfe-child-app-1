import { BaseComponentProps } from 'common/types';

export interface CheckboxProps extends BaseComponentProps {
  checked?: boolean;
  checkedIcon?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  onChange?: CheckboxOnChange;
  value?: any;
}

export type CheckboxOnChange<V = any> = (
  event: React.ChangeEvent<HTMLInputElement>,
  checked: boolean,
  value?: V,
) => void;
