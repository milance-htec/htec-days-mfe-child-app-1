/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, FunctionComponent, useContext } from 'react';
import classnames from 'classnames';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useDebouncedCallback } from 'use-debounce';
import { AuthorizationContent, setCurrentPageTitle, useReefCloud } from '@reef-tech/reef-cloud-auth';
import { useFeature } from '@optimizely/react-sdk';
import { MoreHoriz } from '@material-ui/icons';
import { MenuItem, Select } from '@material-ui/core';

/* Components */
import {
  Button,
  Dropdown,
  Heading,
  Icon,
  Image,
  ItemHolder,
  PageContainer,
  Paragraph,
  Text,
  UserAvatar,
} from 'components/atoms';
import {
  PageHeader,
  Flex,
  PageContent,
  Loader,
  Pagination,
  Table,
  Chip,
  FormInput,
  DateRangePicker,
  PageFilters,
} from 'components/molecules';
import { MultiselectAutocomplete } from 'components/organisms';
import { setToastMessage } from 'components/molecules/toast-message-content';

import { InviteOrganizationUsersModal } from './modals/invite-organization-users-modal';
import { ConfirmInviteOrganizationUsersModal } from './modals/confirm-invite-ogranization-users-modal';
import { AssignRolesOrganizationUsersModal } from './modals/assign-roles-organization-users-modal';
import { ConfirmActivateSuspendUserModal } from './modals/confirm-activate-suspend-user-modal';

/* Types */
import {
  DataAccessDropdownData,
  GQLGetOrganizationUsersResult,
  GQLGetOrganizationUsersVariables,
  GQLGetUserDataAccessResult,
  GQLGetUserDataAccessVariables,
  GQLGetUserStatusesResult,
  GQLGetUserStatusesVariables,
  GQLResendUserInvitationResult,
  GQLResendUserInvitationVariables,
  GQLUpdateUserStatusResult,
  GQLUpdateUserStatusVariables,
  OrganizationUser,
  OrganizationUsersPageQueryParams,
  OrganizationUsersPageSearchTypeQueryParam,
  StatusOption,
} from './organization-users.types';
import {
  InviteOrganizationUsersSummary,
  InviteUserRole,
} from './modals/invite-organization-users-modal/invite-organization-users.types';
import { DropdownOption, DropdownOptionAction } from 'components/atoms/dropdown/dropdown.types';
import { OnInputChangeEvent, SelectOnChange } from 'common/types';
import { TableColumn, TableColumnRenderElement } from 'components/molecules/table/table.types';
import { GQLGetRolesListResult, GQLGetRolesListVariables, RoleListItem } from '../roles/roles.types';
import { ActivateSuspendSelectedUserData } from './modals/confirm-activate-suspend-user-modal/confirm-activate-suspend-user.types';

/* Constants */
import {
  GET_ORGANIZATION_USERS_QUERY,
  GQL_GET_USER_DATA_ACCESS_QUERY,
  GQL_GET_USER_STATUSES_QUERY,
  GQL_RESEND_USER_INVITATION_MUTATION,
  GQL_UPDATE_STATUS_MUTATION,
  ORGANIZATION_ROLES_PAGE_SIZE,
  ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL,
  ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS,
  ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS,
  ORGANIZATION_USERS_SEARCH_TYPE_VALUES,
  ROLES_FILTER_LIMIT_INPUT,
  SEARCH_TYPE_DROPDOWN_OPTIONS,
  SEARCH_USERS_INPUT_TIMEOUT_TIME,
  STATUSES_FILTER_LIMIT_INPUT,
  USER_SEARCH_INPUT_MAX_LIMIT,
} from './organization-users.constants';
import {
  ORGANIZATION_USERS_PAGE_USER_MODULE_OWNER,
  PAGE_NAMES,
  ROUTES,
  USER_ORDER_BY,
  USER_STATUS_COLOR,
  USER_STATUSES,
} from 'common/constants';
import { GQL_GET_ROLES_LIST_QUERY } from '../roles/roles.constants';

/* Utility */
import { areQueryParamsValidAndFixOrganizationUsersPageQueryParams } from './organization-users.utility';
import { AppContext } from 'App';
import { getHumanReadableDate } from 'common/utility';
import { useQueryParams, QueryParamItem } from 'common/hooks/useQueryParams';
import { difference, compact } from 'lodash';
import moment, { Moment } from 'moment';

/* Styles */
import './organization-users.page.scss';

/* Assets */
import addUsersImg from 'assets/images/users.svg';
import noSearchResultsImg from 'assets/images/no-search-results.svg';

export const OrganizationUsersPage: FunctionComponent = () => {
  const [init, setInit] = useState(false);

  const { doesUserHaveRequiredModules, getUserOrganizationId } = useContext(AppContext);

  const [usersFilterAndSortFeature] = useFeature('users_filter_and_sort');
  const [suspendAccountFeature] = useFeature('suspend_account');

  const { userOrganizationId } = useReefCloud();

  const [searchTypeDropdownValue, setSearchTypeDropdownValue] = useState(ORGANIZATION_USERS_SEARCH_TYPE_VALUES.EMAIL);

  const [loaderState, setLoaderState] = useState(false);

  const [isDatepickerOpened, setIsDatepickerOpened] = useState(false);
  const [dateFromFilter, setDateFromFilter] = useState<Moment | null>(null);
  const [dateToFilter, setDateToFilter] = useState<Moment | null>(null);

  const [getOrganizationUsers, { loading: getOrganizationUsersLoading, data: getOrganizationUsersData }] = useLazyQuery<
    GQLGetOrganizationUsersResult,
    GQLGetOrganizationUsersVariables
  >(GET_ORGANIZATION_USERS_QUERY);

  const [isGetOrganizationUsersCalled, setIsGetOrganizationUsersCalled] = useState(false);

  /* Organization users useState */
  const [allUsers, setAllUsers] = useState<OrganizationUser[]>([]);
  const [totalOrganizationUserItems, setTotalOrganizationUserItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /* Search user */
  const [usersSearchInput, setUsersSearchInput] = useState<string | undefined>('');

  /* Confirm invite users modal useState */
  const [confirmInviteUsersModalState, setConfirmInviteUsersModalState] = useState(false);
  const [confirmInviteUsersSummary, setConfirmInviteUsersSummary] = useState<InviteOrganizationUsersSummary | null>(
    null,
  );
  const [
    roleForInviteOrganizationUsersSelected,
    setRoleForInviteOrganizationUsersSelected,
  ] = useState<InviteUserRole | null>(null);

  /* Data access */
  const [dataAccessDropdownState, setDataAccessDropdownState] = useState(-1);
  const [dataAccessDropdownData, setDataAccessDropdownData] = useState<DataAccessDropdownData | null>(null);

  const [getUserDataAccess, { data: getUserDataAccessData }] = useLazyQuery<
    GQLGetUserDataAccessResult,
    GQLGetUserDataAccessVariables
  >(GQL_GET_USER_DATA_ACCESS_QUERY);

  /* User statuses */
  const [userStatusesList, setUserStatusesList] = useState<StatusOption[]>([]);
  const [selectedFilterStatuses, setSelectedFilterStatuses] = useState<StatusOption[]>([]);

  const [getUserStatuses, { data: getUserStatusesData, data: getUserStatusesLoading }] = useLazyQuery<
    GQLGetUserStatusesResult,
    GQLGetUserStatusesVariables
  >(GQL_GET_USER_STATUSES_QUERY);

  /* User roles */
  const [organizationRolesList, setOrganizationRolesList] = useState<RoleListItem[]>([]);
  const [selectedFilterRoles, setSelectedFilterRoles] = useState<RoleListItem[]>([]);

  const [getRolesList, { data: getRolesListData, loading: getRolesListLoading }] = useLazyQuery<
    GQLGetRolesListResult,
    GQLGetRolesListVariables
  >(GQL_GET_ROLES_LIST_QUERY);

  /* Invite organization users useState */
  const [inviteOrganizationUsersModalState, setinviteOrganizationUsersModalState] = useState(false);

  /* Assign roles to user useState */
  const [assignRolesOrganizationUsersModalState, setAssignRolesOrganizationUsersModalState] = useState(false);

  const [assignRoleOrganizationUser, setAssignRoleOrganizationUser] = useState<OrganizationUser | null>(null);

  /* Confirm activate/suspend user useState */
  const [confirmActivateSuspendUserModalState, setConfirmActivateSuspendUserModalState] = useState(false);

  const [
    activateSuspendSelectedUserData,
    setActivateSuspendSelectedUserData,
  ] = useState<ActivateSuspendSelectedUserData | null>(null);

  /* Table */
  const [moreDropdownActiveIndex, setMoreDropdownActiveIndex] = useState(-1);

  /* Resend user invitation */
  const [
    resendUserInvitation,
    { data: resendUserInvitationData, error: resendUserInvitationError, loading: resendUserInvitationLoading },
  ] = useMutation<GQLResendUserInvitationResult, GQLResendUserInvitationVariables>(GQL_RESEND_USER_INVITATION_MUTATION);

  /* Update user status */
  const [
    updateUserStatus,
    { data: updateUserStatusData, error: updateUserStatusError, loading: updateUserStatusLoading },
  ] = useMutation<GQLUpdateUserStatusResult, GQLUpdateUserStatusVariables>(GQL_UPDATE_STATUS_MUTATION);

  // Code query param
  const {
    PAGE,
    SIZE,
    SEARCH,
    ROLE,
    STATUS,
    ORDER_BY,
    DATE_FROM,
    DATE_TO,
    SEARCH_TYPE,
  } = ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS;

  const { setQueryParams, queryParams } = useQueryParams<OrganizationUsersPageQueryParams>({
    baseUrlPredefined: ROUTES.ORGANIZATION_USERS,
    queryParamKeys: [PAGE, SIZE, SEARCH, ROLE, STATUS, ORDER_BY, DATE_FROM, DATE_TO, SEARCH_TYPE],
  });

  const getOrganizationUsersCall = ({
    page,
    size,
    search,
    role,
    status,
    orderBy,
    dateFrom,
    dateTo,
    searchType,
  }: OrganizationUsersPageQueryParams) => {
    const pageParsed =
      page !== null ? parseInt(page, 10) : parseInt(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE);
    const sizeParsed =
      size !== null ? parseInt(size, 10) : parseInt(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.SIZE);
    const searchParamParsed = search !== null ? search : ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH;
    const roleIdsParsed = Array.isArray(role)
      ? role.map((userRole) => parseInt(userRole))
      : role
      ? [parseInt(role)]
      : [];
    const statusesParsed = Array.isArray(status)
      ? status.map((item) => item.toUpperCase())
      : status
      ? [status.toUpperCase()]
      : [];
    const orderByParsed = orderBy !== null ? orderBy : ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.ORDER_BY;
    const dateFromParsed = dateFrom !== null ? dateFrom : ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.DATE_FROM;
    const dateToParsed = dateTo !== null ? dateTo : ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.DATE_TO;
    const searchTypeParsed =
      searchType === 'email' || searchType === 'name'
        ? searchType
        : ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH_TYPE;

    getOrganizationUsers({
      variables: {
        dateFrom: dateFromParsed ?? undefined,
        dateTo: dateToParsed ?? undefined,
        name: searchParamParsed && searchTypeParsed === 'name' ? searchParamParsed : undefined,
        orderBy: orderByParsed ?? undefined,
        organizationId: getUserOrganizationId().toString(),
        pageNumber: pageParsed,
        pageSize: sizeParsed,
        roleIds: roleIdsParsed,
        statuses: statusesParsed,
        email: searchParamParsed && searchTypeParsed === 'email' ? searchParamParsed : undefined,
      },
    });
  };

  const getOrganizationUsersWithDebounce = useDebouncedCallback(
    getOrganizationUsersCall,
    SEARCH_USERS_INPUT_TIMEOUT_TIME,
  );

  /* Parsed value */
  const parsedCurrentPageQuery = queryParams.page !== null ? parseInt(queryParams.page, 10) : 0;
  const parsedPageSizeQuery =
    queryParams.size !== null
      ? parseInt(queryParams.size, 10)
      : parseInt(ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.SIZE);

  const onUserInputChange = (e: OnInputChangeEvent) => {
    const usersSearchValue = e.target.value;

    setUsersSearchInput(usersSearchValue);

    setQueryParams({
      params: [
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.SEARCH,
          value: usersSearchValue,
        },
        ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE,
        ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SIZE,
      ],
    });
  };

  /* Invite organization users modal */
  const setInviteOrganizationUsersModal = (state: boolean) => () => {
    setinviteOrganizationUsersModalState(state);
  };

  const onInviteOrganizationUsersDone = (
    summaryData: InviteOrganizationUsersSummary,
    role: InviteUserRole | null = null,
  ) => {
    setInviteOrganizationUsersModal(false)();

    setConfirmInviteUsersSummary(summaryData);
    setRoleForInviteOrganizationUsersSelected(role);

    setConfirmInviteUsersModal(true)();
  };

  /* Confirm invite users modal */
  const setConfirmInviteUsersModal = (state: boolean) => () => {
    setConfirmInviteUsersModalState(state);

    if (!state) {
      setConfirmInviteUsersSummary(null);
      setRoleForInviteOrganizationUsersSelected(null);

      if (
        queryParams.page === ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE &&
        queryParams.size === ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.SIZE &&
        queryParams.search === ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH
      ) {
        // Refresh list if user is on the first page and limit is default
        const {
          PAGE: PAGE_DEFAULTS,
          SIZE: SIZE_DEFAULTS,
          SEARCH: SEARCH_DEFAULTS,
          ROLE: ROLE_DEFAULTS,
          STATUS: STATUS_DEFAULTS,
          ORDER_BY: ORDER_BY_DEFAULTS,
          DATE_FROM: DATE_FROM_DEFAULTS,
          DATE_TO: DATE_TO_DEFAULTS,
          SEARCH_TYPE: SEARCH_TYPE_DEFAULTS,
        } = ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS;

        getOrganizationUsersCall({
          page: PAGE_DEFAULTS,
          size: SIZE_DEFAULTS,
          search: SEARCH_DEFAULTS,
          role: ROLE_DEFAULTS,
          status: STATUS_DEFAULTS,
          orderBy: ORDER_BY_DEFAULTS,
          dateFrom: DATE_FROM_DEFAULTS,
          dateTo: DATE_TO_DEFAULTS,
          searchType: SEARCH_TYPE_DEFAULTS,
        });
      } else {
        // Refresh users list
        setQueryParams({
          params: [
            ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE,
            ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SIZE,
            ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SEARCH,
          ],
        });
      }
    }
  };

  /* Pagination */
  const goToNextPage = () => {
    const pageParsed =
      queryParams.page !== null
        ? `${parseInt(queryParams.page, 10) + 1}`
        : ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE;
    setQueryParams({
      params: [
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.PAGE,
          value: pageParsed,
        },
      ],
    });
  };

  const goToPreviousPage = () => {
    const pageParsed =
      queryParams.page !== null
        ? `${parseInt(queryParams.page, 10) - 1}`
        : ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE;
    setQueryParams({
      params: [
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.PAGE,
          value: pageParsed,
        },
      ],
    });
  };

  const onPaginationLimitChange: DropdownOptionAction<number> = (pageLimitation) => {
    setQueryParams({
      params: [
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.SIZE,
          value: pageLimitation.toString(),
        },
        ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE,
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

  const getLoaderState = () => {
    return getOrganizationUsersLoading || loaderState || resendUserInvitationLoading || updateUserStatusLoading;
  };

  /* Assign roles to user */
  const onAssignRoleClick = (user: OrganizationUser) => {
    setAssignRoleOrganizationUser(user);
    setAssignRolesOrganizationUsersModal(true)();
  };

  const setAssignRolesOrganizationUsersModal = (state: boolean) => () => {
    setAssignRolesOrganizationUsersModalState(state);
  };

  const onAssignUserRolesDone = (isDone: boolean) => {
    setAssignRolesOrganizationUsersModal(false)();
    if (isDone) {
      getOrganizationUsersCall({ ...queryParams });
      setToastMessage('Roles successfully assigned');
    } else {
      setToastMessage('Roles unsuccessfully assigned', 'error');
    }
  };

  /* Confirm activate/suspend use modal*/
  const setConfirmActivateSuspendUserModal = (state: boolean) => () => {
    setConfirmActivateSuspendUserModalState(state);
  };

  const onActivateSuspendActionClick = () => {
    updateUserStatus({
      variables: {
        organizationId: getUserOrganizationId(),
        userId: activateSuspendSelectedUserData?.selectedUser.id
          ? parseInt(activateSuspendSelectedUserData?.selectedUser.id)
          : 0,
        userStatus: activateSuspendSelectedUserData?.isSuspended ? USER_STATUSES.SUSPENDED : USER_STATUSES.ACTIVE,
      },
    });
    setConfirmActivateSuspendUserModal(false)();
  };

  /* Resend invitation */
  const resendUserInvitationOnClick = ({ id }: OrganizationUser) => {
    resendUserInvitation({
      variables: {
        organizationId: getUserOrganizationId(),
        userId: parseInt(id),
      },
    });
  };

  /* Table props */
  const onMoreDropdownClick = (index: number) => {
    setMoreDropdownActiveIndex(index === moreDropdownActiveIndex ? -1 : index);
  };

  const getDateReadable = (inputDate: any) => {
    const date = getHumanReadableDate(inputDate);
    return date;
  };

  /* Data access */
  const onDataAccessClick = (user: OrganizationUser, index: number) => {
    if (index === -1) {
      setDataAccessDropdownState(-1);
      setDataAccessDropdownData(null);
    } else if (user.id && userOrganizationId) {
      setDataAccessDropdownData(null);
      setDataAccessDropdownState(index);
      getUserDataAccess({
        variables: {
          organizationId: userOrganizationId?.toString(),
          userId: user.id.toString(),
          pageNumber: 0,
          pageSize: 10,
        },
      });
    }
  };

  const onActivateSuspendUserClick = (user: OrganizationUser) => {
    if (user.userStatus === USER_STATUSES.ACTIVE) {
      setActivateSuspendSelectedUserData({ selectedUser: user, isSuspended: true });
    } else {
      setActivateSuspendSelectedUserData({ selectedUser: user, isSuspended: false });
    }
    setConfirmActivateSuspendUserModal(true)();
  };

  const renderName: TableColumnRenderElement<OrganizationUser> = ({ data }) => {
    return (
      <>
        <Flex.Layout flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex.Item>
            <UserAvatar
              firstName={data.givenName}
              lastName={data.familyName}
              email={data.email}
              isUserActive={data.userStatus === USER_STATUSES.ACTIVE}
            ></UserAvatar>
          </Flex.Item>
          <Flex.Item flexGrow={2}>
            <Text
              className="user-info--name"
              bold={data.userStatus === USER_STATUSES.ACTIVE}
              color={data.userStatus === USER_STATUSES.ACTIVE ? 'primary' : 'secondary1'}
            >
              {data.fullName ?? 'Not Available Yet'}
            </Text>
          </Flex.Item>
        </Flex.Layout>
      </>
    );
  };

  const renderEmail: TableColumnRenderElement<OrganizationUser> = ({ data }) => {
    return (
      <>
        <Flex.Layout alignItems="center">
          <Text
            className="user-info--email"
            color={data.userStatus === USER_STATUSES.ACTIVE ? 'primary' : 'secondary1'}
          >
            {data.email}
          </Text>
        </Flex.Layout>
      </>
    );
  };

  const renderRoles: TableColumnRenderElement<OrganizationUser> = ({ data }) => {
    return data.roles.length ? (
      <Flex.Layout justifyContent="flex-start" alignItems="center">
        {data.roles?.slice(0, 2).map((role, index) => (
          <Chip
            className={classnames('no-margins', {
              'role-label-first': index < 1,
              'role-label-second': index >= 1,
            })}
            key={index}
          >
            {role.name}
          </Chip>
        ))}
        {data.roles.length > 2 ? (
          <Chip color="light-gray">
            <Icon>
              <MoreHoriz />
            </Icon>
          </Chip>
        ) : null}
      </Flex.Layout>
    ) : (
      <Flex.Layout justifyContent="flex-start" alignItems="center">
        <Text color="link" className="action-link" onClick={() => onAssignRoleClick(data)}>
          Assign a role
        </Text>
      </Flex.Layout>
    );
  };

  const renderStatus: TableColumnRenderElement<OrganizationUser> = ({ data }) => {
    let status = 'Undefined';
    let color = USER_STATUS_COLOR.UNDEFINED;
    switch (data.userStatus) {
      case USER_STATUSES.ACTIVE:
        status = 'Active';
        color = USER_STATUS_COLOR.ACTIVE;
        break;
      case USER_STATUSES.SUSPENDED:
        status = 'Suspended';
        color = USER_STATUS_COLOR.SUSPENDED;
        break;
      case USER_STATUSES.INVITED:
        status = 'Invited';
        color = USER_STATUS_COLOR.INVITED;
        break;
    }
    return (
      <Flex.Layout className="user-status-wrapper" alignItems="center">
        <Chip color={color} bottomSpacing={false} rightSpacing={false}>
          {status}
        </Chip>
      </Flex.Layout>
    );
  };

  const renderUpdated: TableColumnRenderElement<OrganizationUser> = ({ data }) => (
    <span>
      {data.userStatus === USER_STATUSES.ACTIVE
        ? getDateReadable(data.acceptedOnDate)
        : getDateReadable(data.invitedOnDate)}
    </span>
  );

  const renderDataAccess: TableColumnRenderElement<OrganizationUser> = ({ data, index }) => {
    return (
      <>
        <Flex.Layout alignItems="center">
          <Text color="link" className="view-data-access" onClick={() => onDataAccessClick(data, index)}>
            View Data
          </Text>
        </Flex.Layout>
        <Dropdown
          onDropdownHide={() => {
            onDataAccessClick(data, -1);
          }}
          showDropdown={dataAccessDropdownState === index}
        >
          {dataAccessDropdownData !== null && dataAccessDropdownData.locations.length ? (
            <>
              {dataAccessDropdownData.locations.map((locationItem, locationIndex) => (
                <div className="organization-user-row__data-access-dropdown-item" key={locationIndex}>
                  <Text color="secondary1">{locationItem.name}</Text>
                </div>
              ))}
              {dataAccessDropdownData.totalItems > 10 ? (
                <Text color="secondary2" className="organization-user-row__data-access-dropdown-count">
                  + {dataAccessDropdownData.totalItems - 10} more
                </Text>
              ) : null}
            </>
          ) : null}
        </Dropdown>
      </>
    );
  };

  const renderOptions: TableColumnRenderElement<OrganizationUser> = ({ data, index }) => {
    const moreOptions: DropdownOption[] = [];

    if (doesUserHaveRequiredModules(ORGANIZATION_USERS_PAGE_USER_MODULE_OWNER)) {
      moreOptions.push({ name: 'Assign Role(s)', action: () => onAssignRoleClick(data) });
      if (data.userStatus !== USER_STATUSES.INVITED && suspendAccountFeature) {
        moreOptions.push({
          name: data.userStatus === USER_STATUSES.ACTIVE ? 'Suspend User' : 'Activate User',
          action: () => onActivateSuspendUserClick(data),
        });
      }

      if (data.userStatus === USER_STATUSES.INVITED) {
        moreOptions.push({ name: 'Resend Invitaiton', action: () => resendUserInvitationOnClick(data) });
      }
    }

    return moreOptions.length ? (
      <ItemHolder>
        <Icon qaName="organization-users-row-option-column" onClick={() => onMoreDropdownClick(index)}>
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

  const onSortRoles = (sortedDirection: boolean) => {
    setQueryParams({
      params: [
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.ORDER_BY,
          value: sortedDirection ? USER_ORDER_BY.ROLES_ASC : USER_ORDER_BY.ROLES_DESC,
        },
      ],
    });
  };

  const onSortStatus = (sortedDirection: boolean) => {
    setQueryParams({
      params: [
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.ORDER_BY,
          value: sortedDirection ? USER_ORDER_BY.STATUS_ASC : USER_ORDER_BY.STATUS_DESC,
        },
      ],
    });
  };

  const onSortUpdated = (sortedDirection: boolean) => {
    setQueryParams({
      params: [
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.ORDER_BY,
          value: sortedDirection ? USER_ORDER_BY.DATE_MODIFIED_ASC : USER_ORDER_BY.DATE_MODIFIED_DESC,
        },
      ],
    });
  };

  const tableColumns: TableColumn[] = [
    {
      title: 'Name',
      titleTextAlign: 'left',
      renderElement: renderName,
      columnAlignContent: 'flex-start',
    },
    {
      title: 'Email',
      titleTextAlign: 'left',
      renderElement: renderEmail,
      columnAlignContent: 'flex-start',
      className: 'organization-users__email-column-cell',
    },
    {
      title: 'Role(s)',
      titleTextAlign: 'left',
      renderElement: renderRoles,
      columnAlignContent: 'flex-start',
      sortable: usersFilterAndSortFeature,
      sortColumn: onSortRoles,
      className: 'organization-users__roles-column-cell',
    },
    {
      title: 'Status',
      titleTextAlign: 'left',
      renderElement: renderStatus,
      columnAlignContent: 'flex-start',
      sortable: usersFilterAndSortFeature,
      sortColumn: onSortStatus,
    },
    {
      title: 'Updated',
      titleTextAlign: 'left',
      renderElement: renderUpdated,
      columnAlignContent: 'flex-start',
      sortable: usersFilterAndSortFeature,
      sortColumn: onSortUpdated,
    },
    { title: 'Data Access', titleTextAlign: 'left', renderElement: renderDataAccess, columnAlignContent: 'flex-start' },
    { title: '', renderElement: renderOptions },
  ];

  /* Search type */
  const onSearchTypeChange: SelectOnChange = (data) => {
    const searchTypeValue = data.target.value as OrganizationUsersPageSearchTypeQueryParam;

    setSearchTypeDropdownValue(searchTypeValue);

    if (queryParams.search) {
      setQueryParams({
        params: [
          {
            name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.SEARCH_TYPE,
            value: searchTypeValue,
          },
        ],
      });
    }
  };

  // Multiselect automplete props
  const renderRolesTags = (values: RoleListItem[], getTagProps: (params: any) => any) => {
    return <Text>{`Roles selected: ${values.length}`}</Text>;
  };

  const renderStatusesTags = (values: StatusOption[], getTagProps: (params: any) => any) => {
    return <Text>{`Statuses selected: ${values.length}`}</Text>;
  };

  const getLimitTagsTextRoles = (more: number) => {
    return null;
  };

  const getLimitTagsTextStatuses = (more: number) => {
    return null;
  };

  const onRolesFilterChange = (event: any, values: RoleListItem[]) => {
    setSelectedFilterRoles(values);
    if (selectedFilterRoles.length > values.length) {
      onCloseRoleFilter(values, 'deleted');
    }
  };

  const onCloseRoleFilter = (event: any, reason: string) => {
    const values = reason === 'deleted' ? (event as RoleListItem[]) : selectedFilterRoles;
    setQueryParams({
      params: [
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.ROLE,
          value: values.length ? values.map((role) => role.id) : '',
        },
      ],
    });
  };

  const onStatusFilterChange = (event: any, values: StatusOption[]) => {
    setSelectedFilterStatuses(values);
    if (selectedFilterStatuses.length > values.length) {
      onCloseStatusFilter(values, 'deleted');
    }
  };

  const onCloseStatusFilter = (event: any, reason: string) => {
    const values = reason === 'deleted' ? (event as StatusOption[]) : selectedFilterStatuses;
    setQueryParams({
      params: [
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.STATUS,
          value: values.length ? values.map((status) => status.name.toUpperCase()) : '',
        },
      ],
    });
  };

  const setInitialSelectedRoles = () => {
    if (
      difference(
        Array.isArray(queryParams.role) ? queryParams.role : [queryParams.role],
        selectedFilterRoles.map((filteredRole) => filteredRole.id),
      ).length
    ) {
      Array.isArray(queryParams.role)
        ? setSelectedFilterRoles(
            compact(
              queryParams.role.map((role) => {
                return organizationRolesList.find((organizationRole) => organizationRole.id === role);
              }),
            ),
          )
        : setSelectedFilterRoles(
            queryParams.role
              ? compact([organizationRolesList.find((organizationRole) => organizationRole.id === queryParams.role)])
              : [],
          );
    }
  };

  const setInitialSelectedStatuses = () => {
    if (
      difference(
        Array.isArray(queryParams.status) ? queryParams.status : [queryParams.status],
        selectedFilterStatuses.map((status) => status.name.toUpperCase()),
      ).length
    ) {
      Array.isArray(queryParams.status)
        ? setSelectedFilterStatuses(
            compact(
              queryParams.status.map((status) => {
                return userStatusesList.find((userStatus) => userStatus.name.toUpperCase() === status);
              }),
            ),
          )
        : setSelectedFilterStatuses(
            queryParams.status
              ? compact([userStatusesList.find((userStatus) => userStatus.name.toUpperCase() === queryParams.status)])
              : [],
          );
    }
  };

  /* Date filter */
  const setInitialSelectedDates = () => {
    if (
      dateFromFilter?.format('YYYY-MM-DD') !== queryParams.dateFrom ||
      dateToFilter?.format('YYYY-MM-DD') !== queryParams.dateTo
    ) {
      const dateFromMoment = moment(queryParams.dateFrom);
      const dateToMoment = moment(queryParams.dateTo);
      if (dateFromMoment.isValid() && dateToMoment.isValid()) {
        setDateFromFilter(moment(queryParams.dateFrom));
        setDateToFilter(moment(queryParams.dateTo));
      } else {
        setDateFromFilter(null);
        setDateToFilter(null);
      }
    }
  };

  const onDatesRangeChange = (dates: Moment[]) => {
    setDateFromFilter(dates[0]);
    setDateToFilter(dates[1]);
  };

  const onDatesRangeClosed = () => {
    setIsDatepickerOpened(false);
    setQueryParams({
      params: [
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.DATE_FROM,
          value: dateFromFilter ? dateFromFilter.format('YYYY-MM-DD') : '',
        },
        {
          name: ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.DATE_TO,
          value: dateToFilter ? dateToFilter.format('YYYY-MM-DD') : '',
        },
      ],
    });
  };

  const onDateRangeParamsClear = () => {
    setQueryParams({
      clearParams: [
        ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.DATE_FROM,
        ORGANIZATION_USERS_PAGE_QUERY_PARAMS_KEYS.DATE_TO,
      ],
      operationType: 'replace',
    });
  };

  /* Set filters values from query params */
  const setFilterValuesFromQueryParams = (queryParameters: OrganizationUsersPageQueryParams) => {
    if (queryParameters.searchType && queryParameters.searchType !== searchTypeDropdownValue) {
      setSearchTypeDropdownValue(queryParameters.searchType);
    }

    if (queryParameters.search !== usersSearchInput) {
      setUsersSearchInput(queryParameters.search || '');
    }
  };

  /* Use effect hooks */
  useEffect(() => {
    if (!isDatepickerOpened && dateFromFilter && dateToFilter) {
      onDatesRangeClosed();
    }
  }, [isDatepickerOpened]);

  useEffect(() => {
    setInitialSelectedStatuses();
  }, [userStatusesList]);

  useEffect(() => {
    if (queryParams.dateFrom && queryParams.dateTo) {
      setInitialSelectedDates();
    }
  }, [queryParams.dateFrom, queryParams.dateTo]);

  useEffect(() => {
    setInitialSelectedRoles();
  }, [organizationRolesList]);

  // User statuses hook
  useEffect(() => {
    if (getUserStatusesData?.userStatuses?.statuses) {
      setUserStatusesList(
        getUserStatusesData.userStatuses.statuses.map((status) => {
          let name = status.toLowerCase();
          name = name.charAt(0).toUpperCase() + name.slice(1);
          return { name: name };
        }),
      );
    }
  }, [getUserStatusesData]);

  // Organization roles hook
  useEffect(() => {
    if (getRolesListData?.organizationRolesPage?.content) {
      setOrganizationRolesList(getRolesListData.organizationRolesPage.content);
    }
  }, [getRolesListData]);

  /* Init hook */
  useEffect(() => {
    // Get user statuses and roles list
    if (usersFilterAndSortFeature) {
      getUserStatuses();
      getRolesList({
        variables: {
          organizationId: getUserOrganizationId().toString(),
          pageSize: ORGANIZATION_ROLES_PAGE_SIZE,
        },
      });
    }

    setCurrentPageTitle(PAGE_NAMES.USERS);

    setInit(true);
  }, []);

  /* Organization users data hook */
  useEffect(() => {
    if (isGetOrganizationUsersCalled) {
      setIsGetOrganizationUsersCalled(false);
    }

    if (getOrganizationUsersData?.organizationUsersPage) {
      if (
        !getOrganizationUsersData.organizationUsersPage.content.length &&
        queryParams.page !== ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE
      ) {
        if (queryParams.size) {
          let newQueryParams: QueryParamItem<OrganizationUsersPageQueryParams>[] = [];

          if (getOrganizationUsersData.organizationUsersPage.totalItems <= parseInt(queryParams.size)) {
            // Return to page 1 if total items is less or equal to chosen size
            newQueryParams = [ORGANIZATION_USERS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE];
          } else {
            // Return to last page that has data
            newQueryParams = [
              {
                value: (getOrganizationUsersData.organizationUsersPage.totalPages - 1).toString(),
                name: PAGE,
              },
            ];
          }

          setQueryParams({
            params: newQueryParams,
            operationType: 'replace',
          });
        }
      } else {
        setAllUsers(getOrganizationUsersData.organizationUsersPage.content);
        setTotalOrganizationUserItems(getOrganizationUsersData.organizationUsersPage.totalItems);
        setTotalPages(getOrganizationUsersData.organizationUsersPage.totalPages);
      }
    }
  }, [getOrganizationUsersData]);

  /* Resend invitation hook */
  useEffect(() => {
    if (resendUserInvitationData?.resendInvitation) {
      setToastMessage('Invitation resent');
      getOrganizationUsersCall({ ...queryParams });
    }
  }, [resendUserInvitationData]);

  useEffect(() => {
    if (resendUserInvitationError) {
      setToastMessage('Failed to resend invitation', 'error');
    }
  }, [resendUserInvitationError]);

  /* Update user status hook */
  useEffect(() => {
    if (updateUserStatusData?.updateUserStatus) {
      setToastMessage(`User successfully ${activateSuspendSelectedUserData?.isSuspended ? 'suspended' : 'activated'}!`);
      getOrganizationUsersCall({ ...queryParams });
    }
  }, [updateUserStatusData]);

  useEffect(() => {
    if (updateUserStatusError) {
      setToastMessage('Failed to update user status!', 'error');
    }
  }, [updateUserStatusError]);

  /* On page, size and search query change hook */
  useEffect(() => {
    if (init) {
      if (
        areQueryParamsValidAndFixOrganizationUsersPageQueryParams({
          queryParams,
          paginationPageLimits,
          setQueryParams,
          selectedValues: {
            searchType: searchTypeDropdownValue,
          },
        })
      ) {
        setFilterValuesFromQueryParams(queryParams);

        setInitialSelectedStatuses();
        setInitialSelectedDates();
        setInitialSelectedRoles();

        setIsGetOrganizationUsersCalled(true);
        getOrganizationUsersWithDebounce.callback({ ...queryParams });
      }
    }
  }, [
    init,
    JSON.stringify(queryParams.role),
    JSON.stringify(queryParams.status),
    queryParams.dateFrom,
    queryParams.dateTo,
    queryParams.orderBy,
    queryParams.page,
    queryParams.search,
    queryParams.searchType,
    queryParams.size,
  ]);

  /* Get user data access data hook */
  useEffect(() => {
    if (getUserDataAccessData) {
      if (getUserDataAccessData.organizationUserLocationsPage !== null) {
        const { content, totalItems } = getUserDataAccessData.organizationUserLocationsPage;
        if (content && content.length) {
          setDataAccessDropdownData({
            locations: content,
            totalItems,
          });
        } else {
          setDataAccessDropdownState(-1);
        }
      } else {
        setDataAccessDropdownState(-1);
      }
    }
  }, [getUserDataAccessData]);

  /* Render */
  return (
    <PageContainer flex>
      <Loader loaderFlag={getLoaderState()} />

      <PageHeader className="organization-users__page-header" title={PAGE_NAMES.USERS}>
        <Flex.Layout className="organization-users__page-header--wrapper" flexDirection="column">
          {/* Invite users button */}
          <Flex.Layout className="organization-users__page-header--invite-new-button" alignItems="center">
            {!getOrganizationUsersLoading &&
            !getRolesListLoading &&
            !getUserStatusesLoading &&
            !allUsers.length &&
            !queryParams.search &&
            !isGetOrganizationUsersCalled ? null : (
              <AuthorizationContent requiredModules={ORGANIZATION_USERS_PAGE_USER_MODULE_OWNER}>
                <Button onClick={setInviteOrganizationUsersModal(true)} id="organization-users-invite-users-button">
                  Invite Users
                </Button>
              </AuthorizationContent>
            )}
          </Flex.Layout>
        </Flex.Layout>
      </PageHeader>
      {/* Filters */}
      <PageFilters>
        <Flex.Layout>
          <Select
            className="organization-users__search-type-dropdown"
            id="organization-users-page-search-type-dropdown"
            value={searchTypeDropdownValue}
            onChange={onSearchTypeChange}
          >
            {SEARCH_TYPE_DROPDOWN_OPTIONS.map((menuOption) => (
              <MenuItem value={menuOption.value} key={menuOption.value}>
                {menuOption.name}
              </MenuItem>
            ))}
          </Select>
          <FormInput
            className="users-search"
            id="organization-users-search-input-field"
            maxLength={USER_SEARCH_INPUT_MAX_LIMIT}
            name="search-users"
            onChange={onUserInputChange}
            placeholder="Search users"
            type="search"
            value={usersSearchInput}
            showInputMessage={false}
          />
        </Flex.Layout>
        {usersFilterAndSortFeature ? (
          <Flex.Layout alignItems="flex-end" justifyContent="space-between" width="60%">
            <Flex.Layout flexDirection="column" justifyContent="stretch" width="31%">
              <MultiselectAutocomplete
                options={organizationRolesList}
                value={selectedFilterRoles}
                disableCloseOnSelect
                selectedCount={selectedFilterRoles.length}
                optionLabel="name"
                limitTags={ROLES_FILTER_LIMIT_INPUT}
                label="Roles"
                renderTags={renderRolesTags}
                getLimitTagsText={getLimitTagsTextRoles}
                onChange={onRolesFilterChange}
                onClose={onCloseRoleFilter}
                inputFieldQaName="organization-users-roles-filter-input-field"
                popupIconQaName="organization-users-roles-filter-expand-icon"
                optionQaName="organization-users-roles-filter-option"
              />
            </Flex.Layout>
            <Flex.Layout flexDirection="column" justifyContent="stretch" width="31%">
              <MultiselectAutocomplete
                options={userStatusesList}
                value={selectedFilterStatuses}
                disableCloseOnSelect
                selectedCount={selectedFilterStatuses.length}
                optionLabel="name"
                limitTags={STATUSES_FILTER_LIMIT_INPUT}
                label="Statuses"
                renderTags={renderStatusesTags}
                getLimitTagsText={getLimitTagsTextStatuses}
                onChange={onStatusFilterChange}
                onClose={onCloseStatusFilter}
                inputFieldQaName="organization-users-status-filter-input-field"
                popupIconQaName="organization-users-status-filter-expand-icon"
                optionQaName="organization-users-status-filter-option"
              />
            </Flex.Layout>
            <Flex.Layout flexDirection="column" justifyContent="stretch" width="31%">
              <DateRangePicker
                onChange={onDatesRangeChange}
                startDate={dateFromFilter}
                endDate={dateToFilter}
                onClear={onDateRangeParamsClear}
                setIsOpen={setIsDatepickerOpened}
                emptyLabel="Date range"
                isOpen={isDatepickerOpened}
              />
            </Flex.Layout>
          </Flex.Layout>
        ) : null}
      </PageFilters>

      {/* Conten */}
      <PageContent scrollable={true} className="organization-users-page-content">
        {!getOrganizationUsersLoading &&
        !allUsers.length &&
        !isGetOrganizationUsersCalled &&
        !queryParams.search &&
        !queryParams.dateFrom &&
        !queryParams.dateTo &&
        !queryParams.role &&
        !queryParams.status ? (
          <Flex.Layout
            className="users-table-placeholder"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex.Item flexGrow={1}>
              <Image src={addUsersImg} />
            </Flex.Item>
            <Flex.Item>
              <Heading className="users-table-placeholder_heading" type={4}>
                Start adding users!
              </Heading>
            </Flex.Item>
            <Flex.Item flexGrow={1}>
              <Paragraph className="users-table-placeholder_text">Before you can start managing users,</Paragraph>
              <Paragraph className="users-table-placeholder_text">invite your team.</Paragraph>
            </Flex.Item>
            <AuthorizationContent requiredModules={ORGANIZATION_USERS_PAGE_USER_MODULE_OWNER}>
              <Flex.Item flexGrow={1}>
                <Button
                  onClick={setInviteOrganizationUsersModal(true)}
                  id="organization-users-invite-users-empty-list-button"
                >
                  INVITE USERS
                </Button>
              </Flex.Item>
            </AuthorizationContent>
          </Flex.Layout>
        ) : null}
        {!getOrganizationUsersLoading &&
        !allUsers.length &&
        (queryParams.search || queryParams.dateFrom || queryParams.dateTo || queryParams.role || queryParams.status) ? (
          <Flex.Layout
            className="users-table-placeholder"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex.Item flexGrow={1}>
              <Image src={noSearchResultsImg} />
            </Flex.Item>
            <Flex.Item>
              <Heading className="users-table-placeholder_heading" type={4}>
                No users found!
              </Heading>
            </Flex.Item>
            <Flex.Item flexGrow={1}>
              <Paragraph className="users-table-placeholder_text">Try searching for an another user.</Paragraph>
            </Flex.Item>
          </Flex.Layout>
        ) : null}
        {allUsers.length ? <Table className="organization-users-table" columns={tableColumns} rows={allUsers} /> : null}
      </PageContent>

      {/* Pagination */}
      {!getOrganizationUsersLoading && allUsers && allUsers.length ? (
        <Flex.Layout justifyContent="flex-end">
          <Pagination
            currentPage={parsedCurrentPageQuery + 1}
            pageLimit={parsedPageSizeQuery}
            pageLimitOptions={paginationPageLimits}
            totalCount={totalOrganizationUserItems}
            totalPages={totalPages}
            nextPage={goToNextPage}
            previousPage={goToPreviousPage}
          ></Pagination>
        </Flex.Layout>
      ) : null}

      {/* Modals */}
      <InviteOrganizationUsersModal
        modalState={inviteOrganizationUsersModalState}
        setModalState={setInviteOrganizationUsersModal}
        onInviteOrganizationUsersDone={onInviteOrganizationUsersDone}
        setLoaderState={setLoaderState}
      />

      <ConfirmInviteOrganizationUsersModal
        modalState={confirmInviteUsersModalState}
        setModalState={setConfirmInviteUsersModal}
        inviteOrganizationUsersSummary={confirmInviteUsersSummary}
        selectedRole={roleForInviteOrganizationUsersSelected}
      />

      <AssignRolesOrganizationUsersModal
        modalState={assignRolesOrganizationUsersModalState}
        setModalState={setAssignRolesOrganizationUsersModal}
        organizationUser={assignRoleOrganizationUser}
        onAssignUserRolesDone={onAssignUserRolesDone}
      />

      {suspendAccountFeature ? (
        <ConfirmActivateSuspendUserModal
          modalState={confirmActivateSuspendUserModalState}
          setModalState={setConfirmActivateSuspendUserModal}
          modalData={activateSuspendSelectedUserData}
          onActivateSuspendActionClick={onActivateSuspendActionClick}
        />
      ) : null}
    </PageContainer>
  );
};
