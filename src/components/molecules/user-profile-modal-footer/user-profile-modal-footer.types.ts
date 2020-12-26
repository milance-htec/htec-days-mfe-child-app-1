import { BaseComponentProps } from 'common/types';

export interface UserProfileModalFooterProps extends BaseComponentProps {
  cancelButtonText?: string;
  isCancelButtonDisabled?: boolean;
  isSubmitButtonDisabled?: boolean;
  onCancelClick: () => void;
  onSubmitClick: () => void;
  submitButtonText: string;
}
