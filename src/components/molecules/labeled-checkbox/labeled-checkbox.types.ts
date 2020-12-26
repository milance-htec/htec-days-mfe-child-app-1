import { BaseComponentProps } from 'common/types';
import { CheckboxOnChange } from 'components/atoms/checkbox/checkbox.types';

export interface LabeledCheckboxProps extends BaseComponentProps<HTMLElement> {
  checked?: boolean;
  onChange?: CheckboxOnChange;
  text?: string;
  textOnLeftSide?: boolean;
  value?: any;
}
