import { BaseComponentProps } from 'common/types';
import { Moment } from 'moment';

export interface DatepickerRangeProps extends BaseComponentProps {
  onChange: (date: any) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  startDate?: Moment | null;
  endDate?: Moment | null;
  onClose?: () => void;
  onClick?: () => void;
  onClear?: () => void;
  labelFunc?: (date: any, invalidLabel: string) => string;
  emptyLabel?: string;
  format?: string;
  autoOk?: boolean;
}
