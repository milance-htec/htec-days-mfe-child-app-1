import React, { useState, useEffect, useRef, useContext, FunctionComponent } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import classnames from 'classnames';
import { AuthorizationContent, useReefCloud, setCurrentPageTitle } from '@reef-tech/reef-cloud-auth';
import ViewListIcon from '@material-ui/icons/ViewList';
import AppsOutlinedIcon from '@material-ui/icons/AppsOutlined';
import Masonry from 'react-masonry-css';

/* Components */
import { PageContainer, Button, Paragraph, Icon, ItemHolder, Dropdown, Heading, Image, Text } from 'components/atoms';
import { PageHeader, Flex, PageContent, RoleCard, Loader, FormInput, Table, Pagination } from 'components/molecules';
import { CreateUpdateRoleModal, CreateRoleSuccessModal, ManageModulesModal, DeleteRoleModal } from './modals';
import { ArrowDropDown, ArrowDropUp, MoreHoriz } from '@material-ui/icons';

/* Types */
import {
  GQLCheckRoleNameAvailabilityResult,
  GQLCheckRoleNameAvailabilityVariables,
  GQLCreateRoleResult,
  GQLCreateRoleVariables,
  GQLEditRoleResult,
  GQLEditRoleVariables,
  GQLGetRoleByIdResult,
  GQLGetRoleByIdVariables,
  GQLGetRoleModulesResult,
  GQLGetRoleModulesVariables,
  GQLGetRolesListResult,
  GQLGetRolesListVariables,
  RoleCreateRoleResult,
  RoleGetRoleByIdResult,
  GQLGetOrganizationModulesResult,
  GQLGetOrganizationModulesVariables,
  RoleListItem,
  RoleModalFormValues,
  RoleModules,
  RolesPageQueryParams,
  SetCreateUpdateRoleModalStateProps,
  SetManageRoleModulesModalStateProps,
  RolesPageViewQueryParam,
} from './roles.types';
import { OnInputChangeEvent } from 'common/types';
import { TableColumn, TableColumnRenderElement } from 'components/molecules/table/table.types';
import { DropdownOption, DropdownOptionAction } from 'components/atoms/dropdown/dropdown.types';

/* Constants */
import {
  CHECK_ROLE_NAME_AVAILABILITY_TIMOUT_TIME,
  CREATE_ROLE_MODAL_FORM_INITIAL_VALUES,
  GQL_CHECK_ROLE_NAME_AVAILABILITY_QUERY,
  GQL_CREATE_ROLE_MUTATION,
  GQL_EDIT_ROLE_MUTATION,
  GQL_GET_ROLE_BY_ID_QUERY,
  GQL_GET_ROLE_MODULES_QUERY,
  GQL_GET_ROLES_LIST_QUERY,
  GQL_GET_ORGANIZATION_MODULES_QUERY,
  PAGINATION_DEFAULT_PAGE_SIZE,
  ROLE_MODAL_BUTTON_TITLES,
  ROLE_MODAL_TITLES,
  ROLES_PAGE_QUERY_PARAMS_KEYS,
  ROLES_SEARCH_INPUT_MAX_LIMIT,
  SEARCH_ROLES_INPUT_TIMEOUT_TIME,
  ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL,
  ROLES_PAGE_QUERY_PARAMS_DEFAULTS,
  ROLES_LIST_PAGINATION_DEFAULT_SIZE,
  ROLES_LIST_DEFAULT_SEARCH,
  MAX_DESC_LENGTH,
  ROLES_PAGE_VIEW_VALUES,
} from './roles.constants';
import {
  ROUTES,
  IS_ONLY_ALPHANUMERIC_AND_SPACE_REG_EXP,
  IS_SPACE_NOT_ONLY_PRESENT_REG_EXP,
  PAGE_NAMES,
  ROLES_PAGE_USER_MODULE_OWNER,
  ORGANIZATION_USERS_PAGE_USER_MODULE_OWNER,
  ORGANIZATION_USERS_PAGE_USER_MODULE_VIEWER,
} from 'common/constants';
import { ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS } from '../organization-users/organization-users.constants';

/* Utility */
import { add3Dots, pluralStringHandler } from 'common/utility';
import { setToastMessage } from 'components/molecules/toast-message-content';
import { useIntersectionObserver } from 'common/intersection.hook';
import { useQueryParams, QueryParamItem } from 'common/hooks/useQueryParams';
import { AppContext } from 'App';
import { areQueryParamsValidAndFixRolesPageQueryParams } from './roles.utility';

/* Styles */
import './roles.page.scss';

/* Assets */
import noSearchResultsImg from 'assets/images/no-search-results.svg';
import noRolesImg from 'assets/images/no-items-image.svg';

export const RolesPage: FunctionComponent = () => {
  const { userOrganizationId } = useReefCloud();
  const { doesUserHaveRequiredModules } = useContext(AppContext);

  // Refs
  const pageContentRef = useRef<HTMLDivElement | null>(null);
  const [setRef, visible] = useIntersectionObserver({});

  const [loaderFlag, setLoaderFlag] = useState(false);
  const [init, setInit] = useState(false);
  const [isGetRolesWithDebounceCalled, setIsGetRolesWithDebounceCalled] = useState(false);

  const hasOrganizationUsersPageViewPermission = doesUserHaveRequiredModules(
    ORGANIZATION_USERS_PAGE_USER_MODULE_VIEWER,
  );
  const hasOrganizationUsersPageOwnerPermission = doesUserHaveRequiredModules(
    ORGANIZATION_USERS_PAGE_USER_MODULE_OWNER,
  );

  /* Table */
  const [moreDropdownActiveIndex, setMoreDropdownActiveIndex] = useState(-1);
  const [manageDropdownActiveIndex, setManageDropdownActiveIndex] = useState(-1);

  // Create/Update Role modal
  const [rolesModalState, setRolesModalState] = useState(false);
  const [createUpdateRoleModalTitle, setCreateUpdateRoleModalTitle] = useState(ROLE_MODAL_TITLES.CREATE_NEW_ROLE);
  const [roleModalConfirmButtonText, setRoleModalConfirmButtonText] = useState(ROLE_MODAL_BUTTON_TITLES.CREATE);
  const [selectedRole, setSelectedRole] = useState<RoleGetRoleByIdResult | null>(null);

  // Check role name availability graphQL
  const [
    checkRoleNameAvailability,
    { data: checkRoleNameAvailabilityData, loading: checkRoleNameAvailabilityLoading },
  ] = useLazyQuery<GQLCheckRoleNameAvailabilityResult, GQLCheckRoleNameAvailabilityVariables>(
    GQL_CHECK_ROLE_NAME_AVAILABILITY_QUERY,
  );
  const checkRoleNameAvailabilityWithDebounce = useDebouncedCallback(
    checkRoleNameAvailability,
    CHECK_ROLE_NAME_AVAILABILITY_TIMOUT_TIME,
  );

  // Create role graphQL
  const [createRole, { data: createRoleData, loading: createRoleLoading }] = useMutation<
    GQLCreateRoleResult,
    GQLCreateRoleVariables
  >(GQL_CREATE_ROLE_MUTATION);

  // Get role by id
  const [getRoleIdById, { data: getRoleIdByIdData, loading: getRoleIdByIdLoading }] = useLazyQuery<
    GQLGetRoleByIdResult,
    GQLGetRoleByIdVariables
  >(GQL_GET_ROLE_BY_ID_QUERY);

  // Edit role
  const [editRole, { data: editRoleData, loading: editRoleLoading }] = useMutation<
    GQLEditRoleResult,
    GQLEditRoleVariables
  >(GQL_EDIT_ROLE_MUTATION);

  // Create success modal
  const [createSuccessModalState, setCreateSuccessModalState] = useState(false);
  const [successRole, setSuccessRole] = useState<RoleCreateRoleResult | null>(null);

  // Roles form
  const [
    createUpdateRoleModalFormInitialValues,
    setCreateUpdateRoleModalFormInitialValues,
  ] = useState<RoleModalFormValues>(CREATE_ROLE_MODAL_FORM_INITIAL_VALUES);

  const [isRoleNameAvailable, setIsRoleNameAvailable] = useState<boolean | null>(null);
  const [isRoleNameCorrect, setIsRoleNameCorrect] = useState(false);

  // Manage role modules modal
  const [manageModulesModalState, setManageModulesModalState] = useState(false);
  const [selectedRolesModules, setSelectedRolesModules] = useState<RoleModules | null>(null);

  const [getRoleModules, { data: getRoleModulesData, loading: getRoleModulesLoading }] = useLazyQuery<
    GQLGetRoleModulesResult,
    GQLGetRoleModulesVariables
  >(GQL_GET_ROLE_MODULES_QUERY);

  const [
    getOrganizationModules,
    { data: getOrganizationModulesData, loading: getOrganizationModulesLoading },
  ] = useLazyQuery<GQLGetOrganizationModulesResult, GQLGetOrganizationModulesVariables>(
    GQL_GET_ORGANIZATION_MODULES_QUERY,
  );

  //Delete role modal
  const [deleteRoleModalState, setDeleteRoleModalState] = useState(false);
  const [roleForDeletion, setRoleForDeletion] = useState<RoleListItem | null>(null);

  // Roles list
  const [roles, setRoles] = useState<RoleListItem[]>([]);
  const [rolesSearchInput, setRolesSearchInput] = useState<string | undefined>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [getRolesList, { data: getRolesListData, loading: getRolesListLoading }] = useLazyQuery<
    GQLGetRolesListResult,
    GQLGetRolesListVariables
  >(GQL_GET_ROLES_LIST_QUERY);
  const getRolesListWithDebounce = useDebouncedCallback(getRolesList, SEARCH_ROLES_INPUT_TIMEOUT_TIME);

  const getRolesListCall = (page: string | null, size: string | null, search: string | null) => {
    const pageParsed = typeof page === 'string' ? parseInt(page, 10) : 0;
    const sizeParsed = typeof size === 'string' ? parseInt(size, 10) : PAGINATION_DEFAULT_PAGE_SIZE;
    const nameParsed = typeof search === 'string' ? search : ROLES_LIST_DEFAULT_SEARCH;

    getRolesList({
      variables: {
        name: nameParsed,
        organizationId: userOrganizationId ? userOrganizationId.toString() : '',
        pageNumber: pageParsed,
        pageSize: sizeParsed,
      },
    });
  };

  // Code query param
  const { ROLE, SEARCH, MANAGE_ROLE_MODULES, PAGE, SIZE, VIEW } = ROLES_PAGE_QUERY_PARAMS_KEYS;
  const { ROLE: ORGANIZATION_ROLE } = ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS;

  const { setQueryParams, queryParams } = useQueryParams<RolesPageQueryParams>({
    baseUrlPredefined: ROUTES.ROLES,
    queryParamKeys: [ROLE, SEARCH, MANAGE_ROLE_MODULES, PAGE, SIZE, VIEW],
  });

  // Common get roles list graphQL call
  const getInitialRolesListWithQueryParam = () => {
    getRolesListCall(
      ROLES_PAGE_QUERY_PARAMS_DEFAULTS.PAGE,
      ROLES_PAGE_QUERY_PARAMS_DEFAULTS.SIZE,
      ROLES_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH,
    );
  };

  /* Create update modal */
  const setCreateUpdateRoleModalState = (state: boolean, modalOptions?: SetCreateUpdateRoleModalStateProps) => () => {
    // Prevent modal from closing if name check is in progress
    if (!checkRoleNameAvailabilityLoading) {
      if (!state) {
        // Reset modal form
        setIsRoleNameAvailable(null);
        setIsRoleNameCorrect(false);
        setCreateUpdateRoleModalFormInitialValues(CREATE_ROLE_MODAL_FORM_INITIAL_VALUES);
      } else {
        if (modalOptions && modalOptions.formData) {
          setIsRoleNameAvailable(true);
          setIsRoleNameCorrect(true);

          setCreateUpdateRoleModalFormInitialValues(modalOptions.formData);
        }
      }

      setRolesModalState(state);
      if (modalOptions) {
        if (modalOptions.callback) {
          modalOptions.callback();
        }

        // Remove role id from query params
        if (modalOptions.clearParams) {
          if (queryParams.role) {
            setQueryParams({ clearParams: ROLES_PAGE_QUERY_PARAMS_KEYS.ROLE });
            getRolesListCall(queryParams.page, queryParams.size, queryParams.search);
          } else {
            getInitialRolesListWithQueryParam();
          }
        }
      }
    }
  };

  const setRolesView = (listView: RolesPageViewQueryParam) => {
    let clearParams: string[] = [];
    let paramsToAdd: QueryParamItem<RolesPageQueryParams>[] = [];

    if (listView === 'tiles') {
      clearParams = [ROLES_PAGE_QUERY_PARAMS_KEYS.SIZE, ROLES_PAGE_QUERY_PARAMS_KEYS.PAGE];
      setCurrentPage(0);
      setTotalPages(0);
    } else {
      paramsToAdd = [ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE, ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SIZE];
    }

    setRoles([]);

    setQueryParams({
      params: [
        {
          name: ROLES_PAGE_QUERY_PARAMS_KEYS.VIEW,
          value: listView,
        },
        ...paramsToAdd,
      ],
      clearParams,
    });
  };

  const onRoleNameChange = (eventChange: any) => (e: OnInputChangeEvent) => {
    const roleNameValue = e.target.value;

    // Prevent from spaces being first characters
    if (roleNameValue && roleNameValue.length && roleNameValue[0] === ' ') {
      return;
    }

    // Prevent role name check if it is the same as selected role
    if (selectedRole && selectedRole.name && roleNameValue === selectedRole.name) {
      // Prevent user from typing same role name as selected when check is in progress
      if (checkRoleNameAvailabilityLoading) {
        return;
      }

      setIsRoleNameCorrect(true);
      setIsRoleNameAvailable(true);
      eventChange(e);

      return;
    }

    // Reg exp tests for validity
    if (
      roleNameValue &&
      roleNameValue.length &&
      IS_ONLY_ALPHANUMERIC_AND_SPACE_REG_EXP.test(roleNameValue) &&
      IS_SPACE_NOT_ONLY_PRESENT_REG_EXP.test(roleNameValue) &&
      roleNameValue.length < 51
    ) {
      setIsRoleNameCorrect(true);
      setIsRoleNameAvailable(null);

      checkRoleNameAvailabilityWithDebounce.callback({
        variables: {
          organizationId: userOrganizationId ? parseInt(userOrganizationId) : 0,
          name: roleNameValue,
        },
      });
    } else {
      setIsRoleNameCorrect(false);
    }

    eventChange(e);
  };

  const editRoleSubmit = (values: RoleModalFormValues) => {
    if (selectedRole && values) {
      editRole({
        variables: {
          roleId: parseInt(selectedRole.id),
          organizationId: userOrganizationId ? parseInt(userOrganizationId) : 0,
          name: values.name,
          description: values.description,
        },
      });
    }
  };

  const deleteRoleClick = () => {
    if (roleForDeletion) {
      setQueryParams({
        params: [
          ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SEARCH,
          ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE,
          ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SIZE,
        ],
      });
      setRolesSearchInput('');

      setToastMessage(`Role successfully deleted`);

      setDeleteRoleModal(false)();
      setRoleForDeletion(null);
    }
  };

  const createRoleSubmit = (values: RoleModalFormValues) => {
    if (values.name) {
      createRole({
        variables: {
          organizationId: userOrganizationId ? parseInt(userOrganizationId) : 0,
          name: values.name,
          description: values.description,
        },
      });
    } else {
      console.error('ROLE NAME NOT DEFINED -> NOT SUPPOSE TO HAPPEN');
    }
  };

  const createUpdateRoleSubmit = (values: RoleModalFormValues) => {
    const isRoleEditModeOn = queryParams.role ? true : false;

    if (isRoleEditModeOn) {
      editRoleSubmit(values);
    } else {
      createRoleSubmit(values);
    }
  };

  const onRolesInputChange = (e: OnInputChangeEvent) => {
    const rolesSearchValue = e.target.value;

    setRolesSearchInput(rolesSearchValue);

    setQueryParams({
      params: [
        {
          name: ROLES_PAGE_QUERY_PARAMS_KEYS.SEARCH,
          value: rolesSearchValue,
        },
      ],
    });
  };

  /* Create role success modal */
  const setCreateRoleSuccessModal = (state: boolean, createdSuccessRole: RoleCreateRoleResult | null) => () => {
    setSuccessRole(createdSuccessRole);
    setCreateSuccessModalState(state);
  };

  const goToManageRoleModules = () => {
    setQueryParams({
      params: [
        {
          name: ROLES_PAGE_QUERY_PARAMS_KEYS.MANAGE_ROLE_MODULES,
          value: successRole?.id,
        },
      ],
    });

    setCreateRoleSuccessModal(false, null)();
  };

  /* Manage role modules */
  const setManageModulesModal = (state: boolean, modalOptions?: SetManageRoleModulesModalStateProps) => () => {
    setManageModulesModalState(state);

    if (!state) {
      setSelectedRolesModules(null);
    }

    if (modalOptions) {
      if (modalOptions.clearQueryManageRoleModulesId) {
        // Remove role id from query params
        setQueryParams({
          clearParams: ROLES_PAGE_QUERY_PARAMS_KEYS.MANAGE_ROLE_MODULES,
        });
      }
    }
  };

  const saveRoleModules = () => {
    setManageModulesModal(false, {
      clearQueryManageRoleModulesId: true,
    })();

    setToastMessage('Role modules successfully updated');

    getRolesListCall(queryParams.page, queryParams.size, queryParams.search);
  };
  /* Delete role modal */
  const setDeleteRoleModal = (state: boolean, role: null | RoleListItem = null) => () => {
    setRoleForDeletion(role);
    setDeleteRoleModalState(state);
  };

  const onEditRoleAction = (roleId: string) => {
    if (roleId) {
      setQueryParams({
        params: [
          {
            name: ROLES_PAGE_QUERY_PARAMS_KEYS.ROLE,
            value: roleId.toString(),
          },
        ],
      });
    }
  };

  const deleteRole = (role: RoleListItem) => {
    if (role) {
      setDeleteRoleModal(true, role)();
    }
  };

  const manageModulesAction = (roleId: string) => {
    if (roleId) {
      setQueryParams({
        params: [
          {
            name: ROLES_PAGE_QUERY_PARAMS_KEYS.MANAGE_ROLE_MODULES,
            value: roleId.toString(),
          },
        ],
      });
    }
  };

  /* Parsed value */
  const parsedCurrentPageQuery = queryParams.page !== null ? parseInt(queryParams.page, 10) : 0;
  const parsedPageSizeQuery =
    queryParams.size !== null ? parseInt(queryParams.size, 10) : ROLES_LIST_PAGINATION_DEFAULT_SIZE;

  /* Pagination */
  const goToNextPage = () => {
    const pageParsed =
      queryParams.page !== null ? `${parseInt(queryParams.page, 10) + 1}` : ROLES_PAGE_QUERY_PARAMS_DEFAULTS.PAGE;
    setQueryParams({
      params: [
        {
          name: ROLES_PAGE_QUERY_PARAMS_KEYS.PAGE,
          value: pageParsed,
        },
      ],
    });
  };

  const goToPreviousPage = () => {
    const pageParsed =
      queryParams.page !== null ? `${parseInt(queryParams.page, 10) - 1}` : ROLES_PAGE_QUERY_PARAMS_DEFAULTS.PAGE;
    setQueryParams({
      params: [
        {
          name: ROLES_PAGE_QUERY_PARAMS_KEYS.PAGE,
          value: pageParsed,
        },
      ],
    });
  };

  const onPaginationLimitChange: DropdownOptionAction<number> = (pageLimitation) => {
    setQueryParams({
      params: [
        {
          name: ROLES_PAGE_QUERY_PARAMS_KEYS.SIZE,
          value: pageLimitation.toString(),
        },
        ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE,
      ],
    });
  };

  const paginationPageLimits: DropdownOption<number>[] = [
    {
      value: 10,
      name: '10',
      action: onPaginationLimitChange,
    },
    {
      value: 20,
      name: '20',
      action: onPaginationLimitChange,
    },
    {
      value: 40,
      name: '40',
      action: onPaginationLimitChange,
    },
  ];

  /* Table props */
  const onAddUsersClick = () => {
    if (hasOrganizationUsersPageOwnerPermission) {
      setQueryParams({ params: [], baseRoute: ROUTES.ORGANIZATION_USERS });
    }
  };

  const onUsersClick = (roleId: string) => {
    console.log('dsa');
    if (hasOrganizationUsersPageViewPermission || hasOrganizationUsersPageOwnerPermission) {
      setQueryParams({ params: [{ name: ORGANIZATION_ROLE, value: roleId }], baseRoute: ROUTES.ORGANIZATION_USERS });
    }
  };

  const onMoreDropdownClick = (index: number) => {
    setMoreDropdownActiveIndex(index === moreDropdownActiveIndex ? -1 : index);
  };

  const onManageDropdownClick = (index: number) => {
    setManageDropdownActiveIndex(index === manageDropdownActiveIndex ? -1 : index);
  };

  const renderName: TableColumnRenderElement<RoleListItem> = ({ data }) => {
    return (
      <Flex.Layout className="roles-table__row-name">
        <Paragraph color="blue" size={1}>
          {data.name}
        </Paragraph>
      </Flex.Layout>
    );
  };

  const renderDescription: TableColumnRenderElement<RoleListItem> = ({ data }) => {
    return (
      <Flex.Layout className="roles-table__row-description tooltip">
        {data.description ? add3Dots(data.description, MAX_DESC_LENGTH) : '-'}
        {data.description && data.description.length > MAX_DESC_LENGTH ? (
          <span className="tooltip-text">
            {' '}
            <Paragraph className="role-table__row-description--tooltip" textAlign="center" size={1}>
              {data.description}
            </Paragraph>
          </span>
        ) : null}
      </Flex.Layout>
    );
  };

  const renderUsers: TableColumnRenderElement<RoleListItem> = ({ data }) => {
    return (
      <Flex.Layout alignItems="center">
        {data.numberOfAssignedUsers ? (
          <ItemHolder
            className={classnames('role-table__row-item-number--users', {
              'role-table__row-item-number--users-not-clickable':
                !hasOrganizationUsersPageViewPermission && !hasOrganizationUsersPageOwnerPermission,
            })}
            onClick={() => onUsersClick(data.id)}
          >
            {`${data.numberOfAssignedUsers} ${pluralStringHandler(data.numberOfAssignedUsers, 'User', 'Users')}`}
          </ItemHolder>
        ) : (
          <Paragraph
            className={classnames('role-table__add-users', {
              'role-table__add-users--users-not-clickable': !hasOrganizationUsersPageOwnerPermission,
            })}
            textAlign="center"
            color="link-blue"
            size={1}
            onClick={onAddUsersClick}
          >
            Add users
          </Paragraph>
        )}
      </Flex.Layout>
    );
  };

  const renderModules: TableColumnRenderElement<RoleListItem> = ({ data }) => {
    return (
      <Flex.Layout alignItems="center">
        {data.numberOfAssignedModules ? (
          <Text className="role-table__modules-column-cell">
            {`${data.numberOfAssignedModules}`} Modules/Submodules &nbsp; assigned
          </Text>
        ) : (
          <Paragraph
            className="role-table__row-add-modules"
            textAlign="center"
            color="link-blue"
            onClick={() => manageModulesAction(`${data.id}`)}
            size={1}
          >
            Add modules
          </Paragraph>
        )}
      </Flex.Layout>
    );
  };

  const renderEdit: TableColumnRenderElement<RoleListItem> = ({ data, index }) => {
    const manageOptions: DropdownOption[] = [];

    if (doesUserHaveRequiredModules(ROLES_PAGE_USER_MODULE_OWNER)) {
      manageOptions.push({
        name: 'Edit Role',
        value: data,
        action: (optionData: RoleListItem) => onEditRoleAction(`${optionData.id}`),
      });
      manageOptions.push({
        name: 'Edit Modules',
        value: data,
        action: (optionData: RoleListItem) => manageModulesAction(optionData.id),
      });
    }

    return (
      <ItemHolder>
        <Flex.Layout>
          <Paragraph
            onClick={() => onManageDropdownClick(index)}
            textAlign={'center'}
            className="noselect organization-manage-paragraph"
            color="grey1"
          >
            Manage
          </Paragraph>
          <Icon className="organization-item__option-icon" onClick={() => onManageDropdownClick(index)}>
            {index === manageDropdownActiveIndex ? <ArrowDropUp /> : <ArrowDropDown />}
          </Icon>
        </Flex.Layout>
        <Dropdown
          options={manageOptions}
          onDropdownHide={() => onManageDropdownClick(index)}
          showDropdown={index === manageDropdownActiveIndex}
        />
      </ItemHolder>
    );
  };

  const renderOptions: TableColumnRenderElement<RoleListItem> = ({ data, index }) => {
    const moreOptions: DropdownOption[] = [];

    if (doesUserHaveRequiredModules(ROLES_PAGE_USER_MODULE_OWNER)) {
      moreOptions.push({
        name: 'Delete Role',
        value: data,
        action: (optionData: RoleListItem) => deleteRole(optionData),
      });
    }

    return moreOptions.length ? (
      <ItemHolder>
        <Icon onClick={() => onMoreDropdownClick(index)}>
          <MoreHoriz />
        </Icon>
        <Dropdown
          options={moreOptions}
          onDropdownHide={() => onMoreDropdownClick(index)}
          showDropdown={index === moreDropdownActiveIndex}
        />
      </ItemHolder>
    ) : null;
  };

  const tableColumns: TableColumn[] = [
    { title: 'Name', titleTextAlign: 'left', renderElement: renderName, columnAlignContent: 'flex-start' },
    {
      title: 'Description',
      renderElement: renderDescription,
      titleTextAlign: 'left',
      columnAlignContent: 'flex-start',
    },
    { title: 'Users', renderElement: renderUsers, titleTextAlign: 'left', columnAlignContent: 'flex-start' },
    { title: 'Modules', renderElement: renderModules, titleTextAlign: 'left', columnAlignContent: 'flex-start' },
    { title: 'Edit', renderElement: renderEdit, titleTextAlign: 'left', columnAlignContent: 'flex-start' },
    { title: '', renderElement: renderOptions },
  ];

  const handleNoResultsOnInvalidPage = (dataTotalItems: number, dataTotalPages: number) => {
    if (queryParams.size) {
      let newQueryParams: QueryParamItem<RolesPageQueryParams>[] = [];

      if (dataTotalItems <= parseInt(queryParams.size)) {
        // Return to page 1 if total items is less or equal to chosen size
        newQueryParams = [ROLES_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE];
      } else {
        // Return to last page that has data
        newQueryParams = [
          {
            value: (dataTotalPages - 1).toString(),
            name: PAGE,
          },
        ];
      }

      setQueryParams({
        params: newQueryParams,
        operationType: 'replace',
      });
    }
  };

  /* Set page title */
  useEffect(() => {
    setCurrentPageTitle(PAGE_NAMES.ROLES);

    setInit(true);
    // eslint-disable-next-line
  }, []);

  // Edit role hook
  useEffect(() => {
    const isEditAllowed = doesUserHaveRequiredModules(ROLES_PAGE_USER_MODULE_OWNER);

    if (isEditAllowed) {
      if (queryParams.role) {
        const parsedRoleId = parseInt(queryParams.role, 10);
        const parsedSelectedRoleId = parseInt(selectedRole && selectedRole.id ? selectedRole.id : '', 10);

        if (parsedSelectedRoleId !== parsedRoleId) {
          getRoleIdById({
            variables: {
              organizationId: userOrganizationId ? parseInt(userOrganizationId) : 0,
              roleId: parsedRoleId,
            },
          });
        }
      } else if (selectedRole) {
        setSelectedRole(null);
        setCreateUpdateRoleModalState(false)();
      }
    } else if (queryParams.role) {
      setQueryParams({ clearParams: [ROLES_PAGE_QUERY_PARAMS_KEYS.ROLE], operationType: 'replace' });
    }
    // eslint-disable-next-line
  }, [queryParams.role]);

  // Manage role modules open modal hook
  useEffect(() => {
    if (queryParams.manageRoleModules) {
      const parsedRoleModulesId = parseInt(queryParams.manageRoleModules, 10);

      const parsedselectedRolesModulesId = parseInt(selectedRolesModules?.id ? selectedRolesModules.id : '', 10);

      if (parsedselectedRolesModulesId !== parsedRoleModulesId) {
        getRoleModules({
          variables: {
            organizationId: userOrganizationId ? userOrganizationId.toString() : '0',
            roleId: parsedRoleModulesId.toString(),
          },
        });
        getOrganizationModules({
          variables: {
            organizationId: userOrganizationId ? userOrganizationId.toString() : '0',
            pageNumber: 0,
            pageSize: 99,
          },
        });
      }
    } else if (selectedRolesModules) {
      setManageModulesModal(false)();
    }
    // eslint-disable-next-line
  }, [queryParams.manageRoleModules]);

  /* On page and/or size change hook */
  useEffect(() => {
    if (init) {
      if (
        areQueryParamsValidAndFixRolesPageQueryParams({
          queryParams,
          paginationPageLimits,
          setQueryParams,
        })
      ) {
        if (queryParams.search !== rolesSearchInput) {
          setRolesSearchInput(queryParams.search ?? '');
        }

        setIsGetRolesWithDebounceCalled(true);

        const pageSize = queryParams.size
          ? parseInt(queryParams.size)
          : parseInt(ROLES_PAGE_QUERY_PARAMS_DEFAULTS.SIZE);

        const pageNumber = queryParams.page
          ? parseInt(queryParams.page)
          : parseInt(ROLES_PAGE_QUERY_PARAMS_DEFAULTS.PAGE);

        getRolesListWithDebounce.callback({
          variables: {
            organizationId: userOrganizationId ? userOrganizationId.toString() : '',
            name: queryParams.search ?? '',
            pageSize,
            pageNumber,
          },
        });
      }
    }
    // eslint-disable-next-line
  }, [queryParams.page, queryParams.size, queryParams.search, queryParams.view, init]);

  /* On role created hook */
  useEffect(() => {
    if (createRoleData) {
      if (createRoleData.addOrganizationRole !== null) {
        setToastMessage(`Role successfully created`);

        if (queryParams.search) {
          setQueryParams({ clearAllParams: true });
        } else {
          getInitialRolesListWithQueryParam();
        }

        setCreateUpdateRoleModalState(false)();
        setCreateRoleSuccessModal(true, createRoleData.addOrganizationRole)();
      }
    }
    // eslint-disable-next-line
  }, [createRoleData]);

  /* On get role by id hook */
  useEffect(() => {
    if (getRoleIdByIdData) {
      if (getRoleIdByIdData.findOrganizationRoleById !== null) {
        setSelectedRole(getRoleIdByIdData.findOrganizationRoleById);

        setCreateUpdateRoleModalState(true, {
          formData: {
            name: getRoleIdByIdData.findOrganizationRoleById.name,
            description: getRoleIdByIdData.findOrganizationRoleById.description,
          },
          callback: () => {
            setCreateUpdateRoleModalTitle(ROLE_MODAL_TITLES.EDIT_ROLE);
            setRoleModalConfirmButtonText(ROLE_MODAL_BUTTON_TITLES.EDIT);
          },
        })();
      }
    }
    // eslint-disable-next-line
  }, [getRoleIdByIdData]);

  /* Edit role hook */
  useEffect(() => {
    if (editRoleData) {
      if (editRoleData.updateOrganizationRole !== null) {
        setCreateUpdateRoleModalState(false, {
          clearParams: true,
        })();

        setToastMessage(`Role successfully updated`);

        setCurrentPage(0);
        setTotalPages(0);
      }
    }
    // eslint-disable-next-line
  }, [editRoleData]);

  /* On role name check available hook */
  useEffect(() => {
    if (checkRoleNameAvailabilityData) {
      if (checkRoleNameAvailabilityData.findOrganizationRoleName === null) {
        setIsRoleNameAvailable(true);
      } else {
        setIsRoleNameAvailable(false);
      }
    }
  }, [checkRoleNameAvailabilityData]);

  /* On get role modules hook */
  useEffect(() => {
    if (getRoleModulesData?.findOrganizationRoleModules && getOrganizationModulesData?.organizationModules) {
      const modulesIds = getOrganizationModulesData.organizationModules.content.map(
        (organizationModule) => organizationModule.id,
      );
      const roleModules = getRoleModulesData?.findOrganizationRoleModules.modules.filter((module) =>
        modulesIds.includes(module.id),
      );
      if (getRoleModulesData.findOrganizationRoleModules.modules) {
        getRoleModulesData.findOrganizationRoleModules.modules = roleModules;
        setSelectedRolesModules(getRoleModulesData?.findOrganizationRoleModules);
        setManageModulesModal(true)();
      } else {
        setQueryParams({ clearParams: [ROLES_PAGE_QUERY_PARAMS_KEYS.MANAGE_ROLE_MODULES] });
      }
    }
    // eslint-disable-next-line
  }, [getRoleModulesData, getOrganizationModulesData]);

  /* Get roles list hook */
  useEffect(() => {
    if (isGetRolesWithDebounceCalled) {
      setIsGetRolesWithDebounceCalled(false);
    }

    if (getRolesListData?.organizationRolesPage) {
      if (queryParams.view === ROLES_PAGE_VIEW_VALUES.LIST) {
        if (
          getRolesListData.organizationRolesPage.content.length === 0 &&
          queryParams.page !== ROLES_PAGE_QUERY_PARAMS_DEFAULTS.PAGE
        ) {
          handleNoResultsOnInvalidPage(
            getRolesListData.organizationRolesPage.totalItems,
            getRolesListData.organizationRolesPage.totalPages,
          );
        } else {
          setRoles(getRolesListData.organizationRolesPage.content);
        }
      } else if (queryParams.view === ROLES_PAGE_VIEW_VALUES.TILES) {
        if (currentPage === 0) {
          setRoles(getRolesListData.organizationRolesPage.content);

          // Scroll content to top
          if (pageContentRef && pageContentRef.current) {
            pageContentRef.current.scrollTop = 0;
          }
        } else if (currentPage > 0) {
          setRoles([...roles, ...getRolesListData.organizationRolesPage.content]);
        }
      }

      setTotalItems(getRolesListData.organizationRolesPage.totalItems);
      setTotalPages(getRolesListData.organizationRolesPage.totalPages);
    }
    // eslint-disable-next-line
  }, [getRolesListData]);

  // Roles list scroll loading hook
  useEffect(() => {
    if (queryParams.view === ROLES_PAGE_VIEW_VALUES.TILES) {
      if (currentPage > 0) {
        getRolesList({
          variables: {
            name: queryParams.search ?? '',
            organizationId: userOrganizationId ? userOrganizationId.toString() : '',
            pageNumber: currentPage,
            pageSize: PAGINATION_DEFAULT_PAGE_SIZE,
          },
        });
      }
    }
    // eslint-disable-next-line
  }, [currentPage]);

  // When bottom loading is visible hook
  useEffect(() => {
    if (!getRolesListLoading && visible && totalPages > 0 && totalPages > currentPage + 1) {
      setCurrentPage((p) => p + 1);
    }
    // eslint-disable-next-line
  }, [visible]);

  // Render
  return (
    <PageContainer flex>
      <Loader
        loaderFlag={
          loaderFlag ||
          createRoleLoading ||
          getRoleIdByIdLoading ||
          editRoleLoading ||
          getRoleModulesLoading ||
          getOrganizationModulesLoading ||
          getRolesListLoading
        }
      />

      <PageHeader className="roles__page-header" title={PAGE_NAMES.ROLES}>
        <Flex.Layout className="roles__page-header--wrapper" flexDirection="column">
          <Flex.Layout className="roles__page-header--create-new-button" alignItems="center">
            <AuthorizationContent requiredModules={ROLES_PAGE_USER_MODULE_OWNER}>
              <Button
                id="roles-page-create-new-role-button"
                onClick={setCreateUpdateRoleModalState(true, {
                  callback: () => {
                    setCreateUpdateRoleModalTitle(ROLE_MODAL_TITLES.CREATE_NEW_ROLE);
                    setRoleModalConfirmButtonText(ROLE_MODAL_BUTTON_TITLES.CREATE);
                  },
                })}
              >
                CREATE NEW
              </Button>
            </AuthorizationContent>
          </Flex.Layout>
          <Flex.Layout justifyContent="space-between" alignItems="center">
            <Flex.Item className="roles__page-header--search-wrapper" width="20%">
              <FormInput
                id="roles-page-search-roles-input-field"
                className="roles-search"
                name="search-roles"
                placeholder="Search roles"
                type="search"
                onChange={onRolesInputChange}
                value={rolesSearchInput}
                maxLength={ROLES_SEARCH_INPUT_MAX_LIMIT}
              />
            </Flex.Item>
            {roles.length ? (
              <>
                <Flex.Layout className="roles__page-header--switch-view-wrapper">
                  <Icon
                    className={classnames('roles__page-header--view-icon', {
                      'roles__page-header--view-icon--active': queryParams.view === ROLES_PAGE_VIEW_VALUES.TILES,
                    })}
                    onClick={() => {
                      if (queryParams.view === ROLES_PAGE_VIEW_VALUES.LIST) {
                        setRolesView(ROLES_PAGE_VIEW_VALUES.TILES);
                      }
                    }}
                  >
                    <AppsOutlinedIcon />
                  </Icon>
                  <Icon
                    className={classnames('roles__page-header--view-icon', {
                      'roles__page-header--view-icon--active': queryParams.view === ROLES_PAGE_VIEW_VALUES.LIST,
                    })}
                    onClick={() => {
                      if (queryParams.view === ROLES_PAGE_VIEW_VALUES.TILES) {
                        setRolesView(ROLES_PAGE_VIEW_VALUES.LIST);
                      }
                    }}
                  >
                    <ViewListIcon />
                  </Icon>
                </Flex.Layout>
              </>
            ) : null}
          </Flex.Layout>
        </Flex.Layout>
      </PageHeader>
      <PageContent className="roles-page-content" ref={pageContentRef} scrollable>
        {!getRolesListLoading && !roles.length && !queryParams.search && !isGetRolesWithDebounceCalled ? (
          <Flex.Layout
            className="users-table-placeholder"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex.Item flexGrow={1}>
              <Image src={noRolesImg} />
            </Flex.Item>
            <Flex.Item>
              <Heading className="roles-table-placeholder_heading" type={4}>
                Start adding roles!
              </Heading>
            </Flex.Item>
            <Flex.Item flexGrow={1}>
              <Paragraph className="roles-table-placeholder_text">Before you can start managing roles,</Paragraph>
              <Paragraph className="roles-table-placeholder_text">create a new one.</Paragraph>
            </Flex.Item>
          </Flex.Layout>
        ) : null}
        {!getRolesListLoading && !roles.length && !isGetRolesWithDebounceCalled && queryParams.search ? (
          <Flex.Layout
            className="roles-table-placeholder"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex.Item flexGrow={1}>
              <Image src={noSearchResultsImg} />
            </Flex.Item>
            <Flex.Item>
              <Heading className="roles-table-placeholder_heading" type={4}>
                No roles found!
              </Heading>
            </Flex.Item>
            <Flex.Item flexGrow={1}>
              <Paragraph className="roles-table-placeholder_text">Try searching for an another role.</Paragraph>
            </Flex.Item>
          </Flex.Layout>
        ) : null}
        {queryParams.view === ROLES_PAGE_VIEW_VALUES.LIST ? (
          roles.length ? (
            <Table className="roles-table" columns={tableColumns} rows={roles} />
          ) : null
        ) : (
          <>
            <Masonry
              breakpointCols={4}
              className="roles-page__roles-card-wrapper"
              columnClassName="roles-page__roles-card-column"
            >
              {roles &&
                roles.map((role, index) => (
                  <Flex.Item className="roles-page__role-card" key={index}>
                    <RoleCard
                      deleteAction={() => deleteRole(role)}
                      editAction={() => onEditRoleAction(role.id)}
                      manageModulesAction={() => manageModulesAction(role.id)}
                      role={role}
                      hasOrganizationUsersPageViewPermission={hasOrganizationUsersPageViewPermission}
                      hasOrganizationUsersPageOwnerPermission={hasOrganizationUsersPageOwnerPermission}
                    />
                  </Flex.Item>
                ))}
            </Masonry>

            <Flex.Layout justifyContent="center">
              {currentPage + 1 < totalPages ? (
                <Paragraph
                  ref={setRef}
                  className={classnames({
                    'paragraph--hidden':
                      (totalPages < 2 && !getRolesListLoading) || (!roles.length && !getRolesListLoading),
                  })}
                >
                  Loading...
                </Paragraph>
              ) : null}
            </Flex.Layout>
          </>
        )}
      </PageContent>

      {/* Modals */}
      <CreateUpdateRoleModal
        formInitialValues={createUpdateRoleModalFormInitialValues}
        isRoleNameAvailable={isRoleNameAvailable}
        isRoleNameCheckInProgress={checkRoleNameAvailabilityLoading}
        isRoleNameCorrect={isRoleNameCorrect}
        modalState={rolesModalState}
        modalTitle={createUpdateRoleModalTitle}
        onRoleNameChange={onRoleNameChange}
        roleModalConfirmButtonText={roleModalConfirmButtonText}
        roleQueryParam={queryParams.role}
        selectedRole={selectedRole}
        setModalState={setCreateUpdateRoleModalState}
        submitForm={createUpdateRoleSubmit}
      />

      <ManageModulesModal
        modalState={manageModulesModalState}
        onSaveRoleModules={saveRoleModules}
        organizationId={userOrganizationId ? parseInt(userOrganizationId) : null}
        queryParams={queryParams}
        roleModulesData={selectedRolesModules}
        setLoaderState={setLoaderFlag}
        setModalState={setManageModulesModal}
      />

      <CreateRoleSuccessModal
        goToManageRoleModules={goToManageRoleModules}
        modalState={createSuccessModalState}
        roleName={successRole?.name}
        setModalState={setCreateRoleSuccessModal}
      />

      <DeleteRoleModal
        modalState={deleteRoleModalState}
        onRoleDelete={deleteRoleClick}
        organizationId={userOrganizationId ? parseInt(userOrganizationId) : null}
        role={roleForDeletion}
        setLoaderState={setLoaderFlag}
        setModalState={setDeleteRoleModal}
      />

      {/* Pagination */}
      {!getRolesListLoading && roles && roles.length && queryParams.view === ROLES_PAGE_VIEW_VALUES.LIST ? (
        <Flex.Layout justifyContent="flex-end">
          <Pagination
            currentPage={parsedCurrentPageQuery + 1}
            pageLimit={parsedPageSizeQuery}
            pageLimitOptions={paginationPageLimits}
            totalCount={totalItems}
            totalPages={totalPages}
            nextPage={goToNextPage}
            previousPage={goToPreviousPage}
          ></Pagination>
        </Flex.Layout>
      ) : null}
    </PageContainer>
  );
};
