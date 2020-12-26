import React, { useEffect, useState, useRef, FunctionComponent } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useIntersectionObserver } from 'common/intersection.hook';
import classnames from 'classnames';

/* Components */
import { Modal, Paragraph, Button } from 'components/atoms';
import { Flex, PageContent, Loader } from 'components/molecules';
import { OrganizationModuleRow } from 'components/organisms';

/* Types */
import {
  AssignModulesOrganizationModalProps,
  GQLUpdateOrganizationModulesResult,
  GQLUpdateOrganizationModulesVariables,
  GQLGetOrganizationModulesResult,
  GQLGetOrganizationModulesVariables,
} from './assign-modules-organization.types';

/* Constants */
import {
  GQL_UPDATE_ORGANIZATION_MODULES_MUTATION,
  GQL_GET_ORGANIZATION_MODULES_QUERY,
  ASSIGN_MODULES_DEFAULT_PAGE_SIZE,
} from './assign-modules-organization.constants';

/* Styles */
import './assign-modules-organization.scss';
import { OrganizationModule } from '../../organizations.types';

export const AssignModulesOrganizationModal: FunctionComponent<AssignModulesOrganizationModalProps> = ({
  modalState,
  organization,
  setModalState,
  onAssignOrganizationModulesDone,
}) => {
  return modalState ? (
    <ModalBody
      modalState={modalState}
      organization={organization}
      setModalState={setModalState}
      onAssignOrganizationModulesDone={onAssignOrganizationModulesDone}
    ></ModalBody>
  ) : null;
};

const ModalBody = ({
  modalState,
  organization,
  setModalState,
  onAssignOrganizationModulesDone,
}: AssignModulesOrganizationModalProps) => {
  const pageContentRef = useRef<HTMLDivElement | null>(null);
  const [setRef, visible] = useIntersectionObserver({});

  const [loaderFlag, setLoaderFlag] = useState(true);

  // Modules list
  const [modules, setModules] = useState<OrganizationModule[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalModules, setTotalModules] = useState(0);

  /* Assign module action */
  const [assignModulesButtonDisableState, setAssignModulesButtonDisableState] = useState(true);

  const [organizationModules, setOrganizationModules] = useState<{ [id: string]: boolean }>(
    organization && organization.modules
      ? organization.modules.reduce((accumulator, currentItem) => {
          accumulator[currentItem.id] = true;

          return accumulator;
        }, {} as { [id: string]: boolean })
      : {},
  );

  const [
    updateOrganizationModules,
    { data: updateOrganizationModulesData, loading: updateOrganizationModulesLoading },
  ] = useMutation<GQLUpdateOrganizationModulesResult, GQLUpdateOrganizationModulesVariables>(
    GQL_UPDATE_ORGANIZATION_MODULES_MUTATION,
  );

  const [getModulesList, { data: getModulesListData, loading: getModulesListLoading }] = useLazyQuery<
    GQLGetOrganizationModulesResult,
    GQLGetOrganizationModulesVariables
  >(GQL_GET_ORGANIZATION_MODULES_QUERY);

  const onModuleSelect = (module: OrganizationModule, isSelected: boolean) => {
    const newModules = { ...organizationModules };

    if (!isSelected) {
      delete newModules[module.id];
      setOrganizationModules(newModules);
    } else {
      setOrganizationModules({ ...organizationModules, [module.id]: isSelected });
    }
  };

  const assignModulesToOrganization = () => {
    const modulesIds = Object.keys(organizationModules).reduce((accumulator, currentValue) => {
      if (organizationModules[currentValue]) {
        accumulator.push(parseInt(currentValue));
      }

      return accumulator;
    }, [] as number[]);
    updateOrganizationModules({
      variables: { modulesList: modulesIds, organizationId: organization ? parseInt(organization.id) : 0 },
    });
  };

  /* compare originalOrganizationModules with organizationModules */
  const areModulesChanged = () => {
    const selectedModulesKeys = Object.keys(organizationModules);

    if (
      organization?.modules &&
      (organization.modules.length !== selectedModulesKeys.length ||
        (organization.modules.length !== 0 && selectedModulesKeys.length === 0) ||
        organization.modules.some((value) => !organizationModules[value.id]))
    ) {
      return true;
    }
    return false;
  };

  /* On modules state change hook */
  useEffect(() => {
    modules.length ? setLoaderFlag(false) : setLoaderFlag(true);
  }, [modules]);

  // Modules list scroll loading hook
  useEffect(() => {
    if (currentPage > 0) {
      getModulesList({
        variables: {
          pageNumber: currentPage,
          pageSize: ASSIGN_MODULES_DEFAULT_PAGE_SIZE,
          moduleType: organization?.type ? organization.type : '',
        },
      });
    }
    // eslint-disable-next-line
  }, [currentPage]);

  // When bottom loading is visible hook
  useEffect(() => {
    if (!getModulesListLoading && visible && totalModules > 0 && totalModules > currentPage + 1) {
      setCurrentPage((p) => p + 1);
    }
    // eslint-disable-next-line
  }, [visible]);

  /* organizationUser hook */
  useEffect(() => {
    getModulesList({
      variables: {
        pageNumber: 0,
        pageSize: ASSIGN_MODULES_DEFAULT_PAGE_SIZE,
        moduleType: organization?.type ? organization.type : '',
      },
    });
    // eslint-disable-next-line
  }, [organization]);

  /* Get modules list hook */
  useEffect(() => {
    if (getModulesListData) {
      if (getModulesListData.modulesPage !== null) {
        const { totalPages } = getModulesListData.modulesPage;

        if (currentPage === 0) {
          setModules(getModulesListData.modulesPage.content);

          // Scroll content to top
          if (pageContentRef && pageContentRef.current) {
            pageContentRef.current.scrollTop = 0;
          }
        } else if (currentPage > 0) {
          setModules([...modules, ...getModulesListData.modulesPage.content]);
        }

        setTotalModules(totalPages);
      }
    }
    // eslint-disable-next-line
  }, [getModulesListData]);

  /* Update user modules hook */
  useEffect(() => {
    if (updateOrganizationModulesData) {
      if (updateOrganizationModulesData.assignModules !== null) {
        onAssignOrganizationModulesDone(updateOrganizationModulesData.assignModules);
      }
    }
    // eslint-disable-next-line
  }, [updateOrganizationModulesData]);

  // On user modules change hook
  useEffect(() => {
    if (areModulesChanged()) {
      setAssignModulesButtonDisableState(false);
    } else {
      setAssignModulesButtonDisableState(true);
    }
    // eslint-disable-next-line
  }, [organizationModules]);

  return (
    <Modal
      fixedHeight
      showModal={modalState}
      heading="Assign module(s) to organization"
      onModalBlur={setModalState(false)}
      closeButtonIcon={true}
      footer={
        <Flex.Layout justifyContent="flex-end">
          <Button
            id="organizations-page-assign-modules-organization-modal-assign-module-button"
            disabled={assignModulesButtonDisableState}
            onClick={assignModulesToOrganization}
          >
            ASSIGN MODULE
          </Button>
        </Flex.Layout>
      }
    >
      <Loader loaderFlag={loaderFlag || updateOrganizationModulesLoading} />

      <PageContent ref={pageContentRef} scrollable={true} className="assign-modules-organization-modal-content">
        <Flex.Layout flexDirection="column" alignItems="center">
          {modules &&
            modules.map((module, index) => (
              <Flex.Item className="assign-modules-organization-modal-content__module_row" key={index}>
                <OrganizationModuleRow
                  module={module}
                  onSelect={onModuleSelect}
                  isSelected={organizationModules[module.id]}
                />
              </Flex.Item>
            ))}
          {currentPage + 1 < totalModules ? (
            <Paragraph
              ref={setRef}
              className={classnames({
                'paragraph--hidden':
                  (totalModules < 2 && !getModulesListLoading) ||
                  (!modules.length && !getModulesListLoading) ||
                  loaderFlag,
              })}
            >
              Loading...
            </Paragraph>
          ) : null}
        </Flex.Layout>
      </PageContent>
    </Modal>
  );
};
