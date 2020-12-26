import { ModalBaseProps } from 'common/types';
import {
  InviteOrganizationUsersSummary,
  InviteUserRole,
} from '../invite-organization-users-modal/invite-organization-users.types';

export interface ConfirmInviteOrganizationUsersModalProps extends ModalBaseProps {
  inviteOrganizationUsersSummary: InviteOrganizationUsersSummary | null;
  selectedRole: InviteUserRole | null;
}
