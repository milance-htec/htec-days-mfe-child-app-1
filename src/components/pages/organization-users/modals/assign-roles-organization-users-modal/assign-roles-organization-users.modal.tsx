import React, { useEffect, useState, useRef, FunctionComponent } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useIntersectionObserver } from 'common/intersection.hook';
import classnames from 'classnames';

/* Components */
import { Modal, Paragraph, Button } from 'components/atoms';
import { Flex, PageContent, Loader } from 'components/molecules';
import { OrganizationUserRoleRow } from 'components/organisms';

/* Types */
import {
  AssignRolesOrganizationUsersModalProps,
  GQLUpdateUserRolesResult,
  GQLUpdateUserRolesVariables,
} from './assign-roles-organization-users.types';
import { RoleListItem, GQLGetRolesListResult, GQLGetRolesListVariables } from 'components/pages/roles/roles.types';

/* Constants */
import { GQL_GET_ROLES_LIST_QUERY } from 'components/pages/roles/roles.constants';
import {
  GQL_UPDATE_USER_ROLES_MUTATION,
  ASSIGN_ROLES_DEFAULT_PAGE_SIZE,
} from './assign-roles-organization-users.constants';

/* Styles */
import './assign-roles-organization-users.scss';
import { useReefCloud } from '@reef-tech/reef-cloud-auth';

export const AssignRolesOrganizationUsersModal: FunctionComponent<AssignRolesOrganizationUsersModalProps> = ({
  modalState,
  organizationUser,
  setModalState,
  onAssignUserRolesDone,
}) => {
  return modalState ? (
    <ModalBody
      modalState={modalState}
      organizationUser={organizationUser}
      setModalState={setModalState}
      onAssignUserRolesDone={onAssignUserRolesDone}
    ></ModalBody>
  ) : null;
};

const ModalBody = ({
  modalState,
  organizationUser,
  setModalState,
  onAssignUserRolesDone,
}: AssignRolesOrganizationUsersModalProps) => {
  const pageContentRef = useRef<HTMLDivElement | null>(null);
  const [setRef, visible] = useIntersectionObserver({});

  const [loaderFlag, setLoaderFlag] = useState(true);

  const { userOrganizationId } = useReefCloud();

  // Roles list
  const [roles, setRoles] = useState<RoleListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRoles, setTotalRoles] = useState(0);

  /* Assign roles action */
  const [assignRoleButtonDisableState, setAssignRoleButtonDisableState] = useState(true);

  const [userRoles, setUserRoles] = useState<{ [id: string]: boolean }>(
    organizationUser
      ? organizationUser.roles.reduce((accumulator, currentItem) => {
          accumulator[currentItem.id] = true;

          return accumulator;
        }, {} as { [id: string]: boolean })
      : {},
  );

  const [updateUserRoles, { data: updateUserRolesData, loading: updateUserRolesLoading }] = useMutation<
    GQLUpdateUserRolesResult,
    GQLUpdateUserRolesVariables
  >(GQL_UPDATE_USER_ROLES_MUTATION);

  const [getRolesList, { data: getRolesListData, loading: getRolesListLoading }] = useLazyQuery<
    GQLGetRolesListResult,
    GQLGetRolesListVariables
  >(GQL_GET_ROLES_LIST_QUERY);

  const onRoleSelect = (role: RoleListItem, isSelected: boolean) => {
    const newRoles = { ...userRoles };

    if (!isSelected) {
      delete newRoles[role.id];
      setUserRoles(newRoles);
    } else {
      setUserRoles({ ...userRoles, [role.id]: isSelected });
    }
  };

  const assignRolesToUser = () => {
    const userId = organizationUser ? Number(organizationUser.id) : 0;
    const roleIds = Object.keys(userRoles).reduce((accumulator, currentValue) => {
      if (userRoles[currentValue]) {
        accumulator.push(parseInt(currentValue));
      }

      return accumulator;
    }, [] as number[]);
    const organizationId = userOrganizationId ? parseInt(userOrganizationId) : 0;
    updateUserRoles({ variables: { userId: userId, rolesList: roleIds, organizationId: organizationId } });
  };

  /* compare originalUserRoles with userRoles */
  const areRolesChanged = () => {
    const selectedRolesKeys = Object.keys(userRoles);

    if (
      organizationUser?.roles &&
      (organizationUser.roles.length !== selectedRolesKeys.length ||
        (organizationUser.roles.length !== 0 && selectedRolesKeys.length === 0) ||
        organizationUser.roles.some((value) => !userRoles[value.id]))
    ) {
      return true;
    }
    return false;
  };

  /* On roles state change hook */
  useEffect(() => {
    roles.length ? setLoaderFlag(false) : setLoaderFlag(true);
  }, [roles]);

  // Roles list scroll loading hook
  useEffect(() => {
    if (currentPage > 0) {
      getRolesList({
        variables: {
          organizationId: userOrganizationId ? userOrganizationId.toString() : '0',
          pageNumber: currentPage,
          pageSize: ASSIGN_ROLES_DEFAULT_PAGE_SIZE,
        },
      });
    }
    // eslint-disable-next-line
  }, [currentPage]);

  // When bottom loading is visible hook
  useEffect(() => {
    if (!getRolesListLoading && visible && totalRoles > 0 && totalRoles > currentPage + 1) {
      setCurrentPage((p) => p + 1);
    }
    // eslint-disable-next-line
  }, [visible]);

  /* organizationUser hook */
  useEffect(() => {
    getRolesList({
      variables: {
        organizationId: userOrganizationId ? userOrganizationId.toString() : '0',
        pageNumber: 0,
        pageSize: ASSIGN_ROLES_DEFAULT_PAGE_SIZE,
      },
    });
    // eslint-disable-next-line
  }, [organizationUser]);

  /* Get roles list hook */
  useEffect(() => {
    if (getRolesListData) {
      if (getRolesListData.organizationRolesPage !== null) {
        const { totalPages } = getRolesListData.organizationRolesPage;

        if (currentPage === 0) {
          setRoles(getRolesListData.organizationRolesPage.content);
          // Scroll content to top
          if (pageContentRef && pageContentRef.current) {
            pageContentRef.current.scrollTop = 0;
          }
        } else if (currentPage > 0) {
          setRoles([...roles, ...getRolesListData.organizationRolesPage.content]);
        }
        setTotalRoles(totalPages);
      }
    }
    // eslint-disable-next-line
  }, [getRolesListData]);

  /* Update user roles hook */
  useEffect(() => {
    if (updateUserRolesData) {
      if (updateUserRolesData.assignRoles !== null) {
        onAssignUserRolesDone(updateUserRolesData.assignRoles);
      }
    }
    // eslint-disable-next-line
  }, [updateUserRolesData]);

  // On user roles change hook
  useEffect(() => {
    if (areRolesChanged()) {
      setAssignRoleButtonDisableState(false);
    } else {
      setAssignRoleButtonDisableState(true);
    }
    // eslint-disable-next-line
  }, [userRoles]);

  return (
    <Modal
      fixedHeight
      showModal={modalState}
      heading="Assign role(s) to user"
      onModalBlur={setModalState(false)}
      closeButtonIcon={true}
      footer={
        <Flex.Layout justifyContent="flex-end">
          <Button
            id="organization-users-page-assign-roles-organization-users-modal-assign-role-button"
            data-testid="assign-roles-button"
            disabled={assignRoleButtonDisableState || !Object.keys(userRoles).length}
            onClick={assignRolesToUser}
          >
            ASSIGN ROLE
          </Button>
        </Flex.Layout>
      }
    >
      <Loader loaderFlag={loaderFlag || updateUserRolesLoading} />

      <PageContent ref={pageContentRef} scrollable={true} className="assign-roles-organization-users-modal-content">
        <Flex.Layout flexDirection="column" alignItems="center">
          {roles &&
            roles.map((role, index) => (
              <Flex.Item className="assign-roles-organization-users-modal-content__role_row" key={index}>
                <OrganizationUserRoleRow
                  role={role}
                  onSelect={onRoleSelect}
                  isSelected={userRoles[role.id]}
                ></OrganizationUserRoleRow>
              </Flex.Item>
            ))}
          {currentPage + 1 < totalRoles ? (
            <Paragraph
              ref={setRef}
              className={classnames({
                'paragraph--hidden':
                  (totalRoles < 2 && !getRolesListLoading) || (!roles.length && !getRolesListLoading) || loaderFlag,
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
