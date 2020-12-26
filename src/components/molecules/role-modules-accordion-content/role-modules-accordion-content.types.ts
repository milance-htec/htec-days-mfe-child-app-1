import { BaseComponentProps } from 'common/types';
import { Module } from 'components/pages/roles/roles.types';

export interface RoleModulesAccordionContentProps extends BaseComponentProps {
  module: Module;
  onPermissionClick: (moduleId: string) => (e: React.ChangeEvent<any>) => void;
  parentModule?: Module;
  paddingValue?: number;
  isAccordion?: boolean;
  radioButtonsDisabled?: boolean;
  isSubmodule?: boolean;
  moduleIndex?: number;
}
