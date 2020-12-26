import React, { FunctionComponent } from 'react';
import { Done } from '@material-ui/icons';

/* Components */
import { Modal, Heading, Button, Text, Icon } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types and constants */
import { ConfirmInviteOrganizationUsersModalProps } from './confirm-invite-organization-users.types';

/* Services and utils */
import { pluralStringHandler } from 'common/utility';

/* Styles */
import './confirm-invite-organization-users.scss';

export const ConfirmInviteOrganizationUsersModal: FunctionComponent<ConfirmInviteOrganizationUsersModalProps> = ({
  modalState,
  setModalState,
  inviteOrganizationUsersSummary,
  selectedRole,
}) => {
  /* Render */
  return (
    <Modal showModal={modalState} onModalBlur={setModalState(false)} closeButtonIcon={false}>
      <Flex.Layout
        flexDirection="column"
        alignItems="center"
        className="confirm-invite-organization-users-modal-content"
      >
        <div className="confirm-invite-organization-users-modal__image"></div>

        <Heading className="confirm-invite-organization-users-modal__heading">Invitations sent successfully!</Heading>

        {inviteOrganizationUsersSummary ? (
          <>
            <div className="confirm-invite-organization-users-paragraph">
              <span className="confirm-invite-organization-users-paragraph--users">
                {inviteOrganizationUsersSummary.numberOfInvitedAndAssignedToRole ||
                  inviteOrganizationUsersSummary.numberOfAssignedToRole}
                &nbsp;
                {pluralStringHandler(
                  inviteOrganizationUsersSummary.numberOfInvitedAndAssignedToRole ||
                    inviteOrganizationUsersSummary.numberOfAssignedToRole,
                  'User',
                  'Users',
                )}
              </span>
              &nbsp;
              {pluralStringHandler(
                inviteOrganizationUsersSummary.numberOfInvitedAndAssignedToRole ||
                  inviteOrganizationUsersSummary.numberOfAssignedToRole,
                'was',
                'were',
              )}
              &nbsp;invited to join with the&nbsp;<Text bold>{selectedRole?.name}</Text>&nbsp;role.
              <Icon className="confirm-invite-organization-users-check-icon">
                <Done />
              </Icon>
            </div>
          </>
        ) : null}

        <Button
          id="organization-users-page-confirm-invite-organization-users-modal-go-tousers-list-button"
          onClick={setModalState(false)}
        >
          GO TO USERS LIST
        </Button>
      </Flex.Layout>
    </Modal>
  );
};
