import { Role } from '../../roles.types';

export interface CreateRoleSuccessModalProps {
  goToManageRoleModules: () => void;
  modalState: boolean;
  roleName?: string;
  setModalState: (state: boolean, roleId: Role | null) => () => void;
}
