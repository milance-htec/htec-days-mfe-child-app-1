import { ModalBaseProps, PaginationResponse } from 'common/types';
import { Organization, OrganizationModule } from '../../organizations.types';

export interface AssignModulesOrganizationModalProps extends ModalBaseProps {
  organization: Organization | null;
  onAssignOrganizationModulesDone: (isDone: boolean) => void;
}

/* GraphQL */
export type GQLUpdateOrganizationModulesResult = {
  assignModules: boolean | null;
};

export type GQLUpdateOrganizationModulesVariables = {
  organizationId: number;
  modulesList: number[];
};

export type GQLGetOrganizationModulesResult = {
  modulesPage: PaginationResponse<OrganizationModule> | null;
};

export type GQLGetOrganizationModulesVariables = {
  pageNumber: number;
  pageSize: number;
  moduleType: string;
};
