import React, { FunctionComponent } from 'react';

/* Components */
import { Button } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { UserProfileModalFooterProps } from './user-profile-modal-footer.types';

/* Styles */
import './user-profile-modal-footer.scss';

export const UserProfileModalFooter: FunctionComponent<UserProfileModalFooterProps> = ({
  cancelButtonText = 'Cancel',
  isCancelButtonDisabled = false,
  isSubmitButtonDisabled = false,
  onCancelClick,
  onSubmitClick,
  submitButtonText,
}) => {
  return (
    <Flex.Layout className="user-profile-modal-footer" justifyContent="flex-end" alignItems="center">
      <Button
        variant="secondary"
        className="user-profile-modal-footer__cancel-button"
        disabled={isCancelButtonDisabled}
        onClick={onCancelClick}
      >
        {cancelButtonText}
      </Button>
      <Button onClick={onSubmitClick} disabled={isSubmitButtonDisabled}>
        {submitButtonText}
      </Button>
    </Flex.Layout>
  );
};
