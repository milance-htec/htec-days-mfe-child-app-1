import { ModalBaseProps } from 'common/types';
import { OrganizationUser } from '../../organization-users.types';

export interface ConfirmActivateSuspendUserModalProps extends ModalBaseProps {
  modalData: ActivateSuspendSelectedUserData | null;
  onActivateSuspendActionClick: () => void;
}

export type ActivateSuspendSelectedUserData = {
  selectedUser: OrganizationUser;
  isSuspended: boolean;
};
