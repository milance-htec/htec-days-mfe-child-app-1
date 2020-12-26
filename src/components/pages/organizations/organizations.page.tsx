import React, { useState, useEffect, FunctionComponent, useRef, useContext } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useDebouncedCallback } from 'use-debounce';
import { AuthorizationContent, setCurrentPageTitle } from '@reef-tech/reef-cloud-auth';

/* Components */
import {
  PageContainer,
  Paragraph,
  Image,
  Heading,
  Dropdown,
  Icon,
  ItemHolder,
  UserAvatar,
  Text,
  Button,
} from 'components/atoms';
import { PageHeader, Flex, PageContent, Loader, Pagination, Chip, Table, FormInput } from 'components/molecules';
import { CreateUpdateOrganizationModal } from './modals';
import { ArrowDropDown, ArrowDropUp, MoreHoriz } from '@material-ui/icons';
import { AssignModulesOrganizationModal } from './modals/assign-modules-organization-modal';

/* Types */
import {
  GQLCreateOrganizationResult,
  GQLCreateOrganizationVariables,
  GQLGetOrganizationByIdResult,
  GQLGetOrganizationByIdVariables,
  GQLGetOrganizationsResult,
  GQLGetOrganizationsVariables,
  GQLUpdateOrganizationResult,
  GQLUpdateOrganizationVariables,
  Organization,
  OrganizationModalFormValues,
  OrganizationsPageQueryParams,
  SetCreateUpdateOrganizationModalStateProps,
} from './organizations.types';
import { OnInputChangeEvent } from 'common/types';
import { DropdownOption, DropdownOptionAction } from 'components/atoms/dropdown/dropdown.types';
import { TableColumnRenderElement, TableColumn } from 'components/molecules/table/table.types';

/* Constants */
import {
  CHECK_ORGANIZATION_NAME_AVAILABILITY_TIMOUT_TIME,
  CREATE_ORGANIZATION_MODAL_FORM_INITIAL_VALUES,
  GQL_CHECK_ORGANIZATION_NAME_QUERY,
  GQL_CREATE_NEW_ORGANIZATION_MUTATION,
  GQL_FIND_ORGANIZATION_BY_ID,
  GQL_GET_ORGANIZATIONS_QUERY,
  GQL_UPDATE_ORGANIZATION,
  ORGANIZATION_MODAL_BUTTON_TITLES,
  ORGANIZATION_MODAL_TITLES,
  ORGANIZATIONS_LIST_DEFAULT_SEARCH,
  ORGANIZATIONS_LIST_PAGINATION_DEFAULT_PAGE_SIZE,
  ORGANIZATIONS_LIST_PAGINATION_DEFAULT_SIZE,
  ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL,
  ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS,
  ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS,
  ORGANIZATIONS_SEARCH_INPUT_MAX_LIMIT,
  SEARCH_ORGANIZATIONS_INPUT_TIMEOUT_TIME,
} from './organizations.constants';
import {
  ROUTES,
  PAGE_NAMES,
  ORGANIZATIONS_PAGE_USER_MODULE_OWNER,
  ORGANIZATIONS_PAGE_USER_MODULE_VIEWER,
} from 'common/constants';

/* Services and Utilities */
import { setToastMessage } from 'components/molecules/toast-message-content';
import { useQueryParams, QueryParamItem } from 'common/hooks/useQueryParams';
import { AppContext } from 'App';

/* Styles */
import './organizations.page.scss';

/* Assets */
import noSearchResultsImg from 'assets/images/no-search-results.svg';

export const OrganizationsPage: FunctionComponent = () => {
  const pageContentRef = useRef<HTMLDivElement | null>(null);
  const { doesUserHaveRequiredModules } = useContext(AppContext);
  const [init, setInit] = useState(false);

  const [getOrganizations, { loading: getOrganizationsLoading, data: getOrganizationsData }] = useLazyQuery<
    GQLGetOrganizationsResult,
    GQLGetOrganizationsVariables
  >(GQL_GET_ORGANIZATIONS_QUERY);

  const [
    checkOrganizationName,
    { loading: checkOrganizationNameLoading, data: checkOrganizationNameData, error: checkOrganizationNameError },
  ] = useLazyQuery<{ findOrganizationName: any }, { name: string }>(GQL_CHECK_ORGANIZATION_NAME_QUERY);

  const checkOrganizationNameWithDebounce = useDebouncedCallback(
    checkOrganizationName,
    CHECK_ORGANIZATION_NAME_AVAILABILITY_TIMOUT_TIME,
  );

  const [getOrganizationById, { data: getOrganizationByIdData, loading: getOrganizationByIdLoading }] = useLazyQuery<
    GQLGetOrganizationByIdResult,
    GQLGetOrganizationByIdVariables
  >(GQL_FIND_ORGANIZATION_BY_ID);

  const [
    createNewOrganization,
    { loading: createNewOrganizationLoading, data: createNewOrganizationData },
  ] = useMutation<GQLCreateOrganizationResult, GQLCreateOrganizationVariables>(GQL_CREATE_NEW_ORGANIZATION_MUTATION);

  const [updateOrganization, { loading: updateOrganizationLoading, data: updateOrganizationData }] = useMutation<
    GQLUpdateOrganizationResult,
    GQLUpdateOrganizationVariables
  >(GQL_UPDATE_ORGANIZATION);

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  /* Assign modules to organization */
  const [assignModulesOrganizationModalState, setAssignModulesOrganizationModalState] = useState(false);

  const [assignModulesOrganization, setAssignModulesOrganization] = useState<Organization | null>(null);

  /* Search organizations */
  const [organizationsSearchInput, setOrganizationsSearchInput] = useState<string | undefined>('');

  // Code query param
  const { PAGE, SIZE, SEARCH, ORGANIZATION } = ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS;

  const { setQueryParams, queryParams } = useQueryParams<OrganizationsPageQueryParams>({
    baseUrlPredefined: ROUTES.ORGANIZATIONS,
    queryParamKeys: [PAGE, SIZE, SEARCH, ORGANIZATION],
  });

  /* Create organization */
  const [organizationModalState, setOrganizationModalState] = useState(false);
  const [createUpdateOrganizationModalTitle, setCreateUpdateOrganizationModalTitle] = useState(
    ORGANIZATION_MODAL_TITLES.CREATE_NEW_ORGANIZATION,
  );
  const [organizationModalConfirmButtonText, setOrganizationModalConfirmButtonText] = useState(
    ORGANIZATION_MODAL_BUTTON_TITLES.CREATE,
  );
  const [
    createUpdateOrganizationModalFormInitialValues,
    setCreateUpdateOrganizationModalFormInitialValues,
  ] = useState<OrganizationModalFormValues>(CREATE_ORGANIZATION_MODAL_FORM_INITIAL_VALUES);

  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isOrganizationNameCorrect, setIsOrganizationNameCorrect] = useState(false);
  const [isOrganizationNameAvailable, setIsOrganizationNameAvailable] = useState<boolean | null>(null);
  const [isOrganizationNameCheckInProgress, setIsOrganizationNameCheckInProgress] = useState(false);

  /* Create organization */
  const setCreateUpdateOrganizationModalState = (
    state: boolean,
    modalOptions?: SetCreateUpdateOrganizationModalStateProps,
  ) => () => {
    // Prevent modal from closing if name check is in progress
    if (!checkOrganizationNameLoading) {
      if (!state) {
        // Reset modal form
        setIsOrganizationNameAvailable(null);
        setIsOrganizationNameCorrect(false);
        setCreateUpdateOrganizationModalFormInitialValues(CREATE_ORGANIZATION_MODAL_FORM_INITIAL_VALUES);
      } else {
        if (modalOptions && modalOptions.formData) {
          setIsOrganizationNameAvailable(true);
          setIsOrganizationNameCorrect(true);

          setCreateUpdateOrganizationModalFormInitialValues(modalOptions.formData);
        }
      }

      setOrganizationModalState(state);
      if (modalOptions) {
        if (modalOptions.callback) {
          modalOptions.callback();
        }

        // Remove organization id from query params
        if (modalOptions.clearParams) {
          if (queryParams.organization) {
            setQueryParams({ clearParams: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.ORGANIZATION });
            getOrganizationsCall(queryParams.page, queryParams.size, queryParams.search);
          } else {
            getOrganizationsCall(
              ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE,
              ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.SIZE,
              ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH,
            );
          }
        }
      }
    }
  };

  const onOrganizationNameChange = (eventChange: any) => (e: OnInputChangeEvent) => {
    const organizationName = e.target.value;

    // Prevent from spaces being first characters
    if (organizationName && organizationName.length && organizationName[0] === ' ') {
      return;
    }

    // Reg exp tests for validity
    const isSpaceNotOnlyPresent = /\S/;
    const isOrganizationNameWithForbiddenCharacters = /[^A-Za-z0-9 ]/;

    if (
      organizationName &&
      organizationName.length &&
      !isOrganizationNameWithForbiddenCharacters.test(organizationName) &&
      isSpaceNotOnlyPresent.test(organizationName) &&
      organizationName.length < 51
    ) {
      setIsOrganizationNameCorrect(true);
      setIsOrganizationNameAvailable(null);
      setIsOrganizationNameCheckInProgress(true);

      checkOrganizationNameWithDebounce.callback({
        variables: {
          name: organizationName,
        },
      });
    } else {
      setIsOrganizationNameCorrect(false);
    }

    eventChange(e);
  };

  const createOrganizationSubmit = ({ name, description }: OrganizationModalFormValues) => {
    if (name) {
      createNewOrganization({
        variables: {
          name,
          description,
        },
      });
    } else {
      console.error('ORGANIZATION NAME NOT DEFINED -> NOT SUPPOSE TO HAPPEN');
    }
  };

  const editOrganizationSubmit = (values: OrganizationModalFormValues) => {
    if (selectedOrganization && values) {
      updateOrganization({
        variables: {
          id: parseInt(selectedOrganization.id),
          name: values.name,
          description: values.description ? values.description : '',
        },
      });
    }
  };

  const createUpdateOrganizationSubmit = (values: OrganizationModalFormValues) => {
    const isOrganizationEditModeOn = queryParams.organization ? true : false;

    if (isOrganizationEditModeOn) {
      editOrganizationSubmit(values);
    } else {
      createOrganizationSubmit(values);
    }
  };

  const isQueryValid = (pageQueryParameters: OrganizationsPageQueryParams): { page: boolean; size: boolean } => {
    const sizeParam = pageQueryParameters.size;
    const pageParam = pageQueryParameters.page;

    let isSizeParamInBounds;
    let isPageParamInBounds;

    if (sizeParam !== null && typeof sizeParam === 'string') {
      isSizeParamInBounds = paginationPageLimits.find((limitElement) => {
        return limitElement.value === parseInt(sizeParam, 10);
      });
    }

    if (pageParam !== null && typeof pageParam === 'string') {
      const parsedPageParam = parseInt(pageParam);
      isPageParamInBounds = !isNaN(Number(pageParam)) && parsedPageParam >= 0;
    }

    return {
      size: !!isSizeParamInBounds,
      page: !!isPageParamInBounds,
    };
  };

  const getOrganizationsCall = (page: string | null, size: string | null, search: string | null) => {
    const pageParsed = typeof page === 'string' ? parseInt(page, 10) : 0;
    const sizeParsed = typeof size === 'string' ? parseInt(size, 10) : ORGANIZATIONS_LIST_PAGINATION_DEFAULT_SIZE;
    const nameParsed = typeof search === 'string' ? search : ORGANIZATIONS_LIST_DEFAULT_SEARCH;

    getOrganizations({
      variables: {
        pageNumber: pageParsed,
        pageSize: sizeParsed,
        name: nameParsed,
      },
    });
  };

  const getOrganizationsWithDebounce = useDebouncedCallback(
    getOrganizationsCall,
    SEARCH_ORGANIZATIONS_INPUT_TIMEOUT_TIME,
  );

  const [isGetOrganizationsWithDebounceCalled, setIsGetOrganizationsWithDebounceCalled] = useState(false);

  /* Parsed value */
  const parsedCurrentPageQuery = queryParams.page !== null ? parseInt(queryParams.page, 10) : 0;
  const parsedPageSizeQuery =
    queryParams.size !== null ? parseInt(queryParams.size, 10) : ORGANIZATIONS_LIST_PAGINATION_DEFAULT_PAGE_SIZE;

  /* Pagination */
  const goToNextPage = () => {
    const pageParsed =
      queryParams.page !== null
        ? `${parseInt(queryParams.page, 10) + 1}`
        : ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE;
    setQueryParams({
      params: [
        {
          name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.PAGE,
          value: pageParsed,
        },
      ],
    });
  };

  const goToPreviousPage = () => {
    const pageParsed =
      queryParams.page !== null
        ? `${parseInt(queryParams.page, 10) - 1}`
        : ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE;
    setQueryParams({
      params: [
        {
          name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.PAGE,
          value: pageParsed,
        },
      ],
    });
  };

  const onPaginationLimitChange: DropdownOptionAction<number> = (pageLimitation) => {
    setQueryParams({
      params: [
        {
          name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.SIZE,
          value: pageLimitation.toString(),
        },
        ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE,
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

  const onAssignOrganizationModulesDone = (isDone: boolean) => {
    setAssignModulesOrganizationModal(false)();
    if (isDone) {
      getOrganizationsCall(queryParams.page, queryParams.size, queryParams.search);
      setToastMessage('Modules successfully assigned');
    } else {
      setToastMessage('Modules unsuccessfully assigned', 'error');
    }
  };

  /* Assign modules to organization modal */
  const onAssignModuleClick = (module: Organization) => {
    setAssignModulesOrganization(module);
    setAssignModulesOrganizationModal(true)();
  };

  const setAssignModulesOrganizationModal = (state: boolean) => () => {
    setAssignModulesOrganizationModalState(state);
  };

  /* Table props */
  const [moreDropdownActiveIndex, setMoreDropdownActiveIndex] = useState(-1);
  const [manageDropdownActiveIndex, setManageDropdownActiveIndex] = useState(-1);

  const onMoreDropdownClick = (index: number) => {
    setMoreDropdownActiveIndex(index === moreDropdownActiveIndex ? -1 : index);
  };

  const onManageDropdownClick = (index: number) => {
    setManageDropdownActiveIndex(index === manageDropdownActiveIndex ? -1 : index);
  };

  const renderName: TableColumnRenderElement<Organization> = ({ data }) => {
    return (
      <>
        {data.logoUrl ? (
          <Image src={data.logoUrl} alt="Organization logo" className="organization-logo" />
        ) : (
          <UserAvatar lastName={data.name} isUserActive={true} className="organization-avatar"></UserAvatar>
        )}
        <Text color="primary" bold={true}>
          {data.name}
        </Text>
      </>
    );
  };

  const renderAssignedModules: TableColumnRenderElement<Organization> = ({ data }) => {
    return (
      <Flex.Layout>
        <Paragraph textAlign={'center'} className="noselect" color="grey1">
          {data?.modules?.length}
        </Paragraph>
      </Flex.Layout>
    );
  };

  const renderManage: TableColumnRenderElement<Organization> = ({ data, index }) => {
    const manageOptions: DropdownOption[] = [];

    if (doesUserHaveRequiredModules(ORGANIZATIONS_PAGE_USER_MODULE_OWNER)) {
      manageOptions.push({
        name: 'Modules',
        value: data,
        action: (organization: Organization) => onAssignModuleClick(organization),
      });
      manageOptions.push({ name: 'Users' });
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
          <Icon
            className="organization-item__option-icon"
            qaName="organizations-manage-options"
            onClick={() => onManageDropdownClick(index)}
          >
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

  const renderOptions: TableColumnRenderElement<Organization> = ({ data, index }) => {
    const moreOptions: DropdownOption[] = [];

    moreOptions.push({
      name: 'Rename Org',
      value: data,
      action: (optionData: Organization) => onEditOrganizationAction(optionData.id),
    });

    return (
      <ItemHolder>
        <Icon
          onClick={() => onMoreDropdownClick(index)}
          qaName="organizations-more-options"
          className="organization-item__option-icon"
        >
          <MoreHoriz />
        </Icon>
        <Dropdown
          options={moreOptions}
          onDropdownHide={() => onMoreDropdownClick(index)}
          showDropdown={index === moreDropdownActiveIndex}
        />
      </ItemHolder>
    );
  };

  const tableColumns: TableColumn[] = [
    {
      title: 'Name',
      titleTextAlign: 'left',
      renderElement: renderName,
      columnAlignContent: 'flex-start',
    },
  ];

  tableColumns.push({
    title: 'Assigned Modules',
    titleTextAlign: 'left',
    renderElement: renderAssignedModules,
    columnAlignContent: 'flex-start',
    className: doesUserHaveRequiredModules(ORGANIZATIONS_PAGE_USER_MODULE_VIEWER)
      ? 'organization-table__assign-modules-column'
      : '',
  });

  // Give user with owner permission level for Organizations module
  if (doesUserHaveRequiredModules(ORGANIZATIONS_PAGE_USER_MODULE_OWNER)) {
    tableColumns.push({
      title: '',
      titleTextAlign: 'left',
      renderElement: renderManage,
      columnAlignContent: 'flex-start',
    });

    tableColumns.push({
      title: '',
      titleTextAlign: 'left',
      renderElement: renderOptions,
      columnAlignContent: 'flex-start',
    });
  }

  // eslint-disable-next-line
  const renderCollapsible: TableColumnRenderElement<Organization> = ({ data }) => {
    return (
      <>
        <Flex.Item className="expanding-row-paragraph">
          <Paragraph color="grey1">Assigned Modules: </Paragraph>
        </Flex.Item>
        <Flex.Layout alignItems="center">
          {data?.modules?.length ? (
            data.modules.map((module, moduleIndex) => <Chip key={moduleIndex}>{module.name}</Chip>)
          ) : (
            <Paragraph className="expanding-row-paragraph--no-modules" color="grey1">
              {' '}
              -{' '}
            </Paragraph>
          )}
        </Flex.Layout>
      </>
    );
  };

  const onEditOrganizationAction = (organizationId: string) => {
    if (organizationId) {
      setQueryParams({
        params: [
          {
            name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.ORGANIZATION,
            value: organizationId.toString(),
          },
        ],
      });
    }
  };

  const onOrganizationsInputChange = (e: OnInputChangeEvent) => {
    const organizationSearchValue = e.target.value;

    setOrganizationsSearchInput(organizationSearchValue);

    setQueryParams({
      params: [
        {
          name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.SEARCH,
          value: organizationSearchValue,
        },
        ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE,
        ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SIZE,
      ],
    });
  };

  const isDataContentPresentHandler = (dataTotalItems: number, dataTotalPages: number) => {
    if (queryParams.size) {
      let newQueryParams: QueryParamItem<OrganizationsPageQueryParams>[] = [];

      if (dataTotalItems <= parseInt(queryParams.size)) {
        // Return to page 1 if total items is less or equal to chosen size
        newQueryParams = [ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE];
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
      });
    }
  };

  /* Init hook */
  useEffect(() => {
    const paramsToSet = [];

    // Check if page query param is already set
    if (queryParams.page === null) {
      paramsToSet.push(ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE);
    }

    // Check if size query param is already set
    if (queryParams.size === null) {
      paramsToSet.push(ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SIZE);
    }

    // Set query params if some are not set initially
    if (paramsToSet.length) {
      setQueryParams({
        params: paramsToSet,
        operationType: 'replace',
      });
    }

    setCurrentPageTitle(PAGE_NAMES.ORGANIZATIONS);

    setInit(true);
    // eslint-disable-next-line
  }, []);

  /* Get organizations hook */
  useEffect(() => {
    if (isGetOrganizationsWithDebounceCalled) {
      setIsGetOrganizationsWithDebounceCalled(false);
    }

    if (getOrganizationsData?.findAllOrganizations) {
      if (
        !getOrganizationsData.findAllOrganizations.content.length &&
        queryParams.page !== ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE
      ) {
        const {
          totalPages: totalOrganizationPages,
          totalItems: totalOrganizationItems,
        } = getOrganizationsData.findAllOrganizations;
        isDataContentPresentHandler(totalOrganizationItems, totalOrganizationPages);
      } else {
        const {
          content,
          totalItems: totalOrganizationItems,
          totalPages: totalOrganizationPages,
        } = getOrganizationsData.findAllOrganizations;

        setOrganizations(content ? content : []);
        setTotalItems(totalOrganizationItems ? totalOrganizationItems : 0);
        setTotalPages(totalOrganizationPages ? totalOrganizationPages : 0);

        if (pageContentRef && pageContentRef.current) {
          pageContentRef.current.scrollTop = 0;
        }
      }
    }
    // eslint-disable-next-line
  }, [getOrganizationsData]);

  /* Create organization hook */
  useEffect(() => {
    if (createNewOrganizationData) {
      if (createNewOrganizationData.addOrganization !== null) {
        setCreateUpdateOrganizationModalState(false)();

        setToastMessage('Organization sucessfully created');

        if (
          queryParams.page === ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.PAGE &&
          queryParams.size === ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS.SIZE
        ) {
          getOrganizationsCall(queryParams.page, queryParams.size, queryParams.search);
        } else {
          setQueryParams({
            params: [
              ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE,
              ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SIZE,
            ],
            operationType: 'replace',
          });
        }
      }
    }
    // eslint-disable-next-line
  }, [createNewOrganizationData]);

  /* On page and/or size change hook */
  useEffect(() => {
    if (init) {
      const queryParamsValidity = isQueryValid(queryParams);

      if (queryParams.search && queryParams.search.length > ORGANIZATIONS_SEARCH_INPUT_MAX_LIMIT) {
        const value = queryParams.search.slice(0, ORGANIZATIONS_SEARCH_INPUT_MAX_LIMIT);

        setQueryParams({
          params: [
            {
              name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.SEARCH,
              value,
            },
          ],
          operationType: 'replace',
        });
      } else if (!queryParamsValidity.page || !queryParamsValidity.size) {
        // Correct invalid query param values
        let pageQueryParamToSet: QueryParamItem = ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.PAGE;
        let sizeQueryParamToSet: QueryParamItem = ORGANIZATIONS_PAGE_QUERY_PARAMS_DEFAULTS_FULL.SIZE;

        if (queryParamsValidity.page) {
          pageQueryParamToSet = {
            value: queryParams.page,
            name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.PAGE,
          };
        }

        if (queryParamsValidity.size) {
          sizeQueryParamToSet = {
            value: queryParams.size,
            name: ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.SIZE,
          };
        }

        setQueryParams({
          params: [pageQueryParamToSet, sizeQueryParamToSet],
          operationType: 'replace',
        });
      } else if (queryParams.search === '') {
        setQueryParams({ clearParams: ['search'], operationType: 'replace' });
      } else if (queryParamsValidity.page && queryParamsValidity.size) {
        setOrganizationsSearchInput(queryParams.search ?? '');

        setIsGetOrganizationsWithDebounceCalled(true);
        getOrganizationsWithDebounce.callback(queryParams.page, queryParams.size, queryParams.search);
      }
    }
    // eslint-disable-next-line
  }, [queryParams.page, queryParams.size, queryParams.search, init]);

  // Edit organization hook
  useEffect(() => {
    if (doesUserHaveRequiredModules(ORGANIZATIONS_PAGE_USER_MODULE_OWNER)) {
      if (queryParams.organization) {
        const parsedOrganizationId = parseInt(queryParams.organization, 10);
        const parsedSelectedOrganizationId = parseInt(
          selectedOrganization && selectedOrganization.id ? selectedOrganization.id : '',
          10,
        );

        if (parsedSelectedOrganizationId !== parsedOrganizationId) {
          getOrganizationById({
            variables: {
              id: parsedOrganizationId,
            },
          });
        }
      } else if (selectedOrganization) {
        setSelectedOrganization(null);
      }
    } else if (queryParams.organization) {
      setQueryParams({
        clearParams: [ORGANIZATIONS_PAGE_QUERY_PARAMS_KEYS.ORGANIZATION],
      });
    }

    // eslint-disable-next-line
  }, [queryParams.organization]);

  /* On get organization by id hook */
  useEffect(() => {
    if (getOrganizationByIdData) {
      if (getOrganizationByIdData.findOrganizationById !== null) {
        setSelectedOrganization(getOrganizationByIdData.findOrganizationById);

        setCreateUpdateOrganizationModalState(true, {
          formData: {
            name: getOrganizationByIdData.findOrganizationById.name,
            description: getOrganizationByIdData.findOrganizationById.description,
          },
          callback: () => {
            setCreateUpdateOrganizationModalTitle(ORGANIZATION_MODAL_TITLES.EDIT_ORGANIZATION);
            setOrganizationModalConfirmButtonText(ORGANIZATION_MODAL_BUTTON_TITLES.EDIT);
          },
        })();
      }
    }
    // eslint-disable-next-line
  }, [getOrganizationByIdData]);

  /* Edit organization hook */
  useEffect(() => {
    if (updateOrganizationData) {
      if (updateOrganizationData.updateOrganization !== null) {
        setCreateUpdateOrganizationModalState(false, {
          clearParams: true,
        })();

        if (updateOrganizationData.updateOrganization) {
          setToastMessage(`Organization successfully updated`);
          setTotalPages(0);
        } else {
          setToastMessage(`Organization unsuccessfully updated`, 'error');
        }
      }
    }
    // eslint-disable-next-line
  }, [updateOrganizationData]);

  /* Check organization name hook */
  useEffect(() => {
    if (!checkOrganizationNameLoading) {
      setIsOrganizationNameCheckInProgress(false);

      if (checkOrganizationNameData?.findOrganizationName) {
        setIsOrganizationNameAvailable(false);
      } else {
        setIsOrganizationNameAvailable(true);
      }
    }
  }, [checkOrganizationNameLoading, checkOrganizationNameData]);

  useEffect(() => {
    if (checkOrganizationNameError) {
      setIsOrganizationNameCheckInProgress(false);
    }
  }, [checkOrganizationNameError]);

  /* Render */
  return (
    <PageContainer flex>
      <Loader
        loaderFlag={
          createNewOrganizationLoading ||
          getOrganizationsLoading ||
          getOrganizationByIdLoading ||
          updateOrganizationLoading
        }
      />

      <PageHeader className="organizations__page-header" title={PAGE_NAMES.ORGANIZATIONS}>
        <Flex.Layout className="organizations__page-header--wrapper" flexDirection="column">
          <Flex.Layout className="organizations__page-header--create-new-button" alignItems="center">
            <AuthorizationContent requiredModules={ORGANIZATIONS_PAGE_USER_MODULE_OWNER}>
              <Button
                id="organizations-page-create-new-button"
                onClick={setCreateUpdateOrganizationModalState(true, {
                  callback: () => {
                    setCreateUpdateOrganizationModalTitle(ORGANIZATION_MODAL_TITLES.CREATE_NEW_ORGANIZATION);
                    setOrganizationModalConfirmButtonText(ORGANIZATION_MODAL_BUTTON_TITLES.CREATE);
                  },
                })}
              >
                CREATE NEW
              </Button>
            </AuthorizationContent>
          </Flex.Layout>
          <Flex.Layout justifyContent="space-between" alignItems="center">
            <Flex.Item className="organizations__page-header--search-wrapper" width="20%">
              <FormInput
                id="organizations-page-search-input-field"
                maxLength={ORGANIZATIONS_SEARCH_INPUT_MAX_LIMIT}
                name="search-organizations"
                onChange={onOrganizationsInputChange}
                placeholder="Search organizations"
                type="search"
                value={organizationsSearchInput}
              />
            </Flex.Item>
          </Flex.Layout>
        </Flex.Layout>
      </PageHeader>
      <PageContent ref={pageContentRef} scrollable={true} className="organizations-page-content">
        {!getOrganizationsLoading && !organizations.length && !isGetOrganizationsWithDebounceCalled ? (
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
                No organization found!
              </Heading>
            </Flex.Item>
            <Flex.Item flexGrow={1}>
              <Paragraph className="users-table-placeholder_text">Try searching for an another organization.</Paragraph>
            </Flex.Item>
          </Flex.Layout>
        ) : null}
        {organizations.length ? (
          <Table
            className="organizations-table"
            columns={tableColumns}
            rows={organizations}
            collapsibleRendered={renderCollapsible}
          />
        ) : null}
      </PageContent>

      <AssignModulesOrganizationModal
        modalState={assignModulesOrganizationModalState}
        setModalState={setAssignModulesOrganizationModal}
        organization={assignModulesOrganization}
        onAssignOrganizationModulesDone={onAssignOrganizationModulesDone}
      />

      <CreateUpdateOrganizationModal
        formInitialValues={createUpdateOrganizationModalFormInitialValues}
        isOrganizationNameAvailable={isOrganizationNameAvailable}
        isOrganizationNameCheckInProgress={checkOrganizationNameLoading || isOrganizationNameCheckInProgress}
        isOrganizationNameCorrect={isOrganizationNameCorrect}
        modalState={organizationModalState}
        modalTitle={createUpdateOrganizationModalTitle}
        onOrganizationNameChange={onOrganizationNameChange}
        organizationModalConfirmButtonText={organizationModalConfirmButtonText}
        organizationQueryParam={queryParams.organization}
        selectedOrganization={selectedOrganization}
        setModalState={setCreateUpdateOrganizationModalState}
        submitForm={createUpdateOrganizationSubmit}
      />

      {/* Pagination */}
      {!getOrganizationsLoading && organizations && organizations.length ? (
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
