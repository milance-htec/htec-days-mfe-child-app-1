import { BaseComponentProps } from 'common/types';

export interface LabeledRadioProps extends BaseComponentProps {
  text?: string;
  group?: string;
  textOnLeftSide?: boolean;
  value?: any;
  isChecked?: boolean;
  onRadioButtonClick?: (value?: any) => void;
}
