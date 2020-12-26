import { BaseComponentProps } from 'common/types';
import { OrganizationModule } from 'components/pages/organizations/organizations.types';

export interface OrganizationModuleRowProps extends BaseComponentProps {
  module: OrganizationModule;
  isSelected?: boolean;
  onSelect: (module: OrganizationModule, isSelected: boolean) => void;
}
