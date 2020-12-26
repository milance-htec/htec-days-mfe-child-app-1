import React, { FunctionComponent } from 'react';

/* Components */
import { Modal, Heading, Button } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { ConfirmActivateSuspendUserModalProps } from './confirm-activate-suspend-user.types';

/* Utility */
import { makeFullName } from 'common/utility';

/* Styles */
import './confirm-activate-suspend-user.scss';

export const ConfirmActivateSuspendUserModal: FunctionComponent<ConfirmActivateSuspendUserModalProps> = (props) => {
  return props.modalState ? <ModalBody {...props} /> : null;
};
const ModalBody: FunctionComponent<ConfirmActivateSuspendUserModalProps> = ({
  setModalState,
  modalData,
  onActivateSuspendActionClick,
}) => {
  const onActionClick = () => {
    onActivateSuspendActionClick();
  };

  return (
    <Modal showModal onModalBlur={setModalState(false)} closeButtonIcon={false}>
      <Flex.Layout flexDirection="column" alignItems="center" className="confirm-activate-suspend-user-modal-content">
        <Heading className="confirm-activate-suspend-user-modal__heading">{`Are you sure you want to ${
          modalData?.isSuspended ? 'suspend' : 'activate'
        } ${
          modalData?.selectedUser?.fullName
            ? modalData?.selectedUser?.fullName
            : makeFullName(modalData?.selectedUser?.givenName, modalData?.selectedUser?.familyName)
        }?`}</Heading>

        <Flex.Layout
          className="confirm-activate-suspend-user-modal__action-wrapper"
          flexDirection="row"
          justifyContent="space-evenly"
        >
          <Button
            id="organization-users-page-confirm-activate-suspend-user-modal-cancel-button"
            onClick={setModalState(false)}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            id="organization-users-page-confirm-activate-suspend-user-modal-action-button"
            data-testid="confirm-activate-suspend-user-modal-action-button"
            onClick={onActionClick}
          >
            {`${modalData?.isSuspended ? 'SUSPEND' : 'ACTIVATE'}`}
          </Button>
        </Flex.Layout>
      </Flex.Layout>
    </Modal>
  );
};
