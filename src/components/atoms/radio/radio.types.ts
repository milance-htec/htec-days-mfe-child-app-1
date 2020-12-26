import { BaseComponentProps, OnInputChange } from 'common/types';

export interface RadioProps extends BaseComponentProps<HTMLInputElement> {
  group?: string;
  onChange?: OnInputChange;
  checked: boolean;
  value?: string;
  disabled?: boolean;
}
