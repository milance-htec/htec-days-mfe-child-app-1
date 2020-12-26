import React, { FunctionComponent } from 'react';

/* Components */
import { Modal, Heading, Paragraph, Text, Button, ItemHolder } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { CreateRoleSuccessModalProps } from './create-role-success.types';

export const CreateRoleSuccessModal: FunctionComponent<CreateRoleSuccessModalProps> = ({
  goToManageRoleModules = () => {},
  modalState = false,
  roleName = '',
  setModalState = () => () => {},
}) =>
  modalState ? (
    <Modal showModal onModalBlur={setModalState(false, null)} closeButtonIcon={false}>
      <Flex.Layout flexDirection="column" justifyContent="center">
        <Heading textAlign="center" bottomSpacing>
          Success !
        </Heading>

        <Paragraph textAlign="center" bottomSpacing>
          <Text bold>{roleName} role</Text> has been created
        </Paragraph>

        <Flex.Layout justifyContent="center">
          <Button onClick={setModalState(false, null)} id="roles-page-create-role-success-modal-close-button">
            Close
          </Button>
          <ItemHolder leftSpacing>
            <Button onClick={goToManageRoleModules} id="roles-page-create-role-success-modal-add-modules-button">
              Add Modules
            </Button>
          </ItemHolder>
        </Flex.Layout>
      </Flex.Layout>
    </Modal>
  ) : null;
