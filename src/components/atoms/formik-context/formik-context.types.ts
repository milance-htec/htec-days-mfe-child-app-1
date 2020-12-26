import { BaseComponentProps } from 'common/types';

export interface FormikContextProps extends BaseComponentProps {
  onValuesUpdate: (values: any) => void;
}
