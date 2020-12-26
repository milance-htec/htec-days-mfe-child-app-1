import React, { useEffect, useState, FunctionComponent } from 'react';
import { useMutation } from '@apollo/react-hooks';

/* Components */
import { Modal, Heading, Paragraph, Button, ItemHolder } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { DeleteRoleModalProps } from './delete-role.types';
import { GQLDeleteRoleByIdResult, GQLDeleteRoleByIdVariables } from './delete-role.types';

/* Constants */
import { ROLE_MODAL_BUTTON_TITLES } from '../../roles.constants';
import { GQL_DELETE_ROLE_BY_ID_MUTATION } from './delete-role.constants';

export const DeleteRoleModal: FunctionComponent<DeleteRoleModalProps> = (props) =>
  props.modalState ? <ModalBody {...props} /> : null;

const ModalBody: FunctionComponent<DeleteRoleModalProps> = ({
  onRoleDelete,
  role,
  setLoaderState,
  setModalState,
  organizationId,
}) => {
  const [isRoleRemovable, setIsRoleRemovable] = useState(false);

  const [deleteRole, { data: deleteRoleData, loading: deleteRoleDataLoading }] = useMutation<
    GQLDeleteRoleByIdResult,
    GQLDeleteRoleByIdVariables
  >(GQL_DELETE_ROLE_BY_ID_MUTATION);

  const [deleteRoleModalContent, setDeleteRoleModalContent] = useState({
    deleteModalTitle: 'Are you sure?' as null | string,
    deleteRoleModalConfirmBtn: ROLE_MODAL_BUTTON_TITLES.REMOVE as null | string,
    deleteRoleModalContentText: 'Before deleting, you must manage usere. Do you want to proceede?' as null | string,
  });

  useEffect(() => {
    if (role?.numberOfAssignedUsers && role.numberOfAssignedUsers > 0) {
      setIsRoleRemovable(false);
      setDeleteRoleModalContent({
        deleteModalTitle: null,
        deleteRoleModalConfirmBtn: null,
        deleteRoleModalContentText: 'Roles with assigned users cannot be deleted.',
      });
    } else {
      setIsRoleRemovable(true);
      setDeleteRoleModalContent({
        deleteRoleModalConfirmBtn: ROLE_MODAL_BUTTON_TITLES.REMOVE,
        deleteModalTitle: `This role has ${role?.numberOfAssignedModules} assigned ${
          role?.numberOfAssignedModules === 1 ? 'module' : 'modules'
        }`,
        deleteRoleModalContentText: `Do you still want to remove  ${role?.name}  role?`,
      });
    }
  }, [role]);

  const onConfirm = () => {
    if (isRoleRemovable && role) {
      deleteRole({
        variables: {
          roleId: parseInt(role.id),
          organizationId: organizationId || 0,
        },
      });
    }
  };

  useEffect(() => {
    if (deleteRoleData) {
      if (deleteRoleData.deleteOrganizationRole) {
        onRoleDelete();
      }
    }
    // eslint-disable-next-line
  }, [deleteRoleData]);

  /* Loading hook */
  useEffect(() => {
    setLoaderState(deleteRoleDataLoading);
    // eslint-disable-next-line
  }, [deleteRoleDataLoading]);

  return (
    <Modal showModal onModalBlur={setModalState(false)} closeButtonIcon={false}>
      <Flex.Layout flexDirection="column" justifyContent="center">
        {deleteRoleModalContent.deleteModalTitle && (
          <Heading textAlign="center" bottomSpacing>
            {deleteRoleModalContent.deleteModalTitle}
          </Heading>
        )}

        <Paragraph textAlign="center" bottomSpacing>
          {deleteRoleModalContent.deleteRoleModalContentText}
        </Paragraph>

        <Flex.Layout flexDirection="row" justifyContent="center">
          <Button id="roles-page-delete-role-modal-cancel-button" onClick={setModalState(false)} variant="ghost">
            Cancel
          </Button>
          {deleteRoleModalContent.deleteRoleModalConfirmBtn && (
            <ItemHolder leftSpacing>
              <Button id="roles-page-delete-role-modal-delete-button" disabled={!isRoleRemovable} onClick={onConfirm}>
                {deleteRoleModalContent.deleteRoleModalConfirmBtn}
              </Button>
            </ItemHolder>
          )}
        </Flex.Layout>
      </Flex.Layout>
    </Modal>
  );
};
