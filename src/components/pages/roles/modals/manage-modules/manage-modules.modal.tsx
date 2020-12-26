import React, { useEffect, useState, FunctionComponent, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import classnames from 'classnames';
import { AuthorizationContent } from '@reef-tech/reef-cloud-auth';

/* Components */
import { Modal, Button } from 'components/atoms';
import { Accordion, Flex, RoleModulesAccordionContent } from 'components/molecules';

/* Constants */
import { GQL_SAVE_ROLE_MODULES_MUTATION } from './manage-modules.constants';
import { ROLES_PAGE_USER_MODULE_OWNER } from 'common/constants';

/* Types */
import {
  ManageModulesModalProps,
  GQLSaveRoleModulesResult,
  GQLSaveRoleModulesVariables,
  SaveRoleModulesModule,
} from './manage-modules.types';
import { Module } from '../../roles.types';

/* Utilities */
import { deepCopy, deepEqual } from 'common/utility';
import { AppContext } from 'App';

/* Styles */
import './manage-modules.scss';

export const ManageModulesModal: FunctionComponent<ManageModulesModalProps> = (props) =>
  props.modalState ? <ModalBody {...props} /> : null;

const ModalBody: FunctionComponent<ManageModulesModalProps> = ({
  onSaveRoleModules,
  queryParams,
  roleModulesData,
  setLoaderState,
  setModalState,
  organizationId,
}) => {
  const [newModuleAccordionData, setNewModuleAccordionData] = useState<Module[]>([]);

  const { doesUserHaveRequiredModules } = useContext(AppContext);

  const [saveRoleModules, { data: saveRoleModulesData, loading: saveRoleModulesLoading }] = useMutation<
    GQLSaveRoleModulesResult,
    GQLSaveRoleModulesVariables
  >(GQL_SAVE_ROLE_MODULES_MUTATION);

  const compareData = (initialData: Module[], newData: Module[]) => {
    const comparedData = newData.filter((moduleItem, ind) => {
      return !deepEqual(moduleItem, initialData[ind]);
    });
    return comparedData;
  };

  const assignModuleValue = (moduleItem: Module, targetValue: string) => {
    if (moduleItem.subModules) {
      moduleItem.subModules.forEach((sub: any) => {
        sub.permissionLevel = targetValue;
        assignModuleValue(sub, targetValue);
      });
    }
  };

  const findSelectedModule = (accordionData: Module[], targetValue: string, moduleId: string) => {
    for (const moduleItem of accordionData) {
      if (moduleItem.id === moduleId) {
        moduleItem.permissionLevel = targetValue;
        assignModuleValue(moduleItem, targetValue);
        break;
      } else {
        if (moduleItem.subModules) {
          findSelectedModule(moduleItem.subModules, targetValue, moduleId);
        }
      }
    }
  };
  const onPermissionClick = (moduleId: string) => (e: React.ChangeEvent<any>) => {
    const targetValue = e.target.value;
    const tempData = [...newModuleAccordionData];

    findSelectedModule(tempData, targetValue, moduleId);

    setNewModuleAccordionData(tempData);
  };
  const closeModal = () => {
    return setModalState(false, {
      clearQueryManageRoleModulesId: queryParams && queryParams.manageRoleModules ? true : false,
    });
  };

  const getTransformedModulesData = (modules: Module[]) => {
    const newTrasformedModules: SaveRoleModulesModule[] = [];

    for (const moduleItem of modules) {
      if (!moduleItem.subModules) {
        newTrasformedModules.push({
          id: parseInt(moduleItem.id),
          permissionLevel: moduleItem.permissionLevel,
        });
      } else {
        newTrasformedModules.push({
          id: parseInt(moduleItem.id),
          permissionLevel: moduleItem.permissionLevel,
          subModules: getTransformedModulesData(moduleItem.subModules),
        });
      }
    }

    return newTrasformedModules;
  };

  const onSaveRoleModulesSubmit = (roleId: number, finalOutputData: Module[]) => {
    const modulesToSave = getTransformedModulesData(finalOutputData);

    saveRoleModules({
      variables: {
        roleId,
        organizationId: organizationId || 0,
        modules: modulesToSave,
      },
    });
  };

  const makeAccordions = (
    module: Module,
    index: number,
    parentModule?: Module,
    isSubmodule: boolean = false,
    paddingValue: number = 0,
  ) => {
    const PADDING_VALUE = 2.5;
    return module.subModules ? (
      <Accordion
        key={index}
        className={classnames('manage_modal__accordion-container', {
          'manage_modal__accordion-container--expandible': isSubmodule,
        })}
        content={
          <RoleModulesAccordionContent
            radioButtonsDisabled={!doesUserHaveRequiredModules(ROLES_PAGE_USER_MODULE_OWNER)}
            module={module}
            parentModule={parentModule}
            onPermissionClick={onPermissionClick}
            paddingValue={paddingValue}
            isSubmodule={isSubmodule}
            moduleIndex={index}
            isAccordion
          />
        }
        expandible={module.subModules.map((submodule, submoduleIndex) => {
          return makeAccordions(submodule, submoduleIndex, module, true, paddingValue + PADDING_VALUE);
        })}
        expandiblePadding={paddingValue}
      />
    ) : (
      <RoleModulesAccordionContent
        radioButtonsDisabled={!doesUserHaveRequiredModules(ROLES_PAGE_USER_MODULE_OWNER)}
        key={index}
        className={classnames('manage_modal__classic-row', { 'manage_modal__classic-row--submodule': isSubmodule })}
        module={module}
        parentModule={parentModule}
        isSubmodule={isSubmodule}
        onPermissionClick={onPermissionClick}
        paddingValue={paddingValue}
        moduleIndex={index}
      />
    );
  };

  useEffect(() => {
    if (roleModulesData) {
      setNewModuleAccordionData(deepCopy(roleModulesData.modules));
    }
  }, [roleModulesData]);

  /* On save role modules call result */
  useEffect(() => {
    if (saveRoleModulesData) {
      onSaveRoleModules();
    }
    // eslint-disable-next-line
  }, [saveRoleModulesData]);

  // Set page loader
  useEffect(() => {
    setLoaderState(saveRoleModulesLoading);
    // eslint-disable-next-line
  }, [saveRoleModulesLoading]);

  return (
    <Modal
      className="manage-modules-modal"
      fixedHeight={true}
      showModal
      heading={`Assigned modules to ${roleModulesData?.name}`}
      onModalBlur={closeModal()}
      footer={
        <AuthorizationContent requiredModules={ROLES_PAGE_USER_MODULE_OWNER}>
          <Flex.Layout justifyContent="flex-end">
            <Button
              id="roles-page-manage-modules-modal-assign-button"
              onClick={() => {
                if (roleModulesData) {
                  onSaveRoleModulesSubmit(
                    parseInt(roleModulesData.id),
                    compareData(roleModulesData.modules, newModuleAccordionData),
                  );
                }
              }}
            >
              Assign
            </Button>
          </Flex.Layout>
        </AuthorizationContent>
      }
    >
      {/* <Table columns={tableColumns} rows={roleModulesData?.modules} collapsibleRendered={renderCollapsible} /> */}
      <Flex.Layout flexDirection="column">
        <Flex.Layout alignItems="center" className="manage_modal__accordion-header">
          <Flex.Item className="manage_modal__accordion-header--name">Name</Flex.Item>
          <Flex.Item className="manage_modal__accordion-header--status">Status</Flex.Item>
          <Flex.Item className="manage_modal__accordion-header--no-access">No Access</Flex.Item>
          <Flex.Item className="manage_modal__accordion-header--viewer">Viewer</Flex.Item>
          <Flex.Item className="manage_modal__accordion-header--owner">Owner</Flex.Item>
        </Flex.Layout>
        <Flex.Layout
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          className="manage_modal__accordion-content-container"
        >
          {newModuleAccordionData ? newModuleAccordionData.map((module, index) => makeAccordions(module, index)) : null}
        </Flex.Layout>
      </Flex.Layout>
    </Modal>
  );
};
