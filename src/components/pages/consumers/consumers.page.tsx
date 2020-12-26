/* eslint-disable react-hooks/exhaustive-deps */
import React, { FunctionComponent, useEffect, useState, useContext } from 'react';
import { setCurrentPageTitle } from '@reef-tech/reef-cloud-auth';
import { useLazyQuery } from '@apollo/react-hooks';
import { MoreHoriz } from '@material-ui/icons';
import { MenuItem, Select } from '@material-ui/core';
import classnames from 'classnames';

/* Components */
import {
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
import { PageHeader, PageContent, Flex, Table, Chip, PageFilters, FormInput, Loader } from 'components/molecules';
import { ConsumerProfileModal } from 'components/organisms';

/* Types */
import {
  Consumer,
  ConsumersPageQueryParams,
  ConsumersPageRegionQueryParam,
  ConsumersPageSearchTypeQueryParam,
  GQLGetConsumerPageResult,
  GQLGetConsumerPageResultVariables,
} from './consumers.types';
import { DropdownOption } from 'components/atoms/dropdown/dropdown.types';
import { TableColumn, TableColumnRenderElement } from 'components/molecules/table/table.types';
import { OnInputChange, SelectOnChange, OnInputKeyboardEvent } from 'common/types';

/* Constants */
import {
  CONSUMER_STATUSES,
  PAGE_NAMES,
  ROUTES,
  CONSUMER_STATUS_COLOR,
  INPUT_KEYBOARD_KEYS,
  CONSUMERS_USER_MODULE_OWNER,
} from 'common/constants';
import {
  CONSUMERS_PAGE_QUERY_PARAMS_DEFAULTS,
  CONSUMERS_PAGE_QUERY_PARAMS_KEYS,
  CONSUMERS_PAGE_REGION_DROPDOWN_OPTIONS,
  CONSUMERS_PAGE_REGION_OPTIONS_PAIRS,
  CONSUMERS_PAGE_SEARCH_TYPE_DROPDOWN_OPTIONS,
  CONSUMERS_PAGE_SEARCH_TYPE_QUERY_PARAM_VALUES,
  CONSUMERS_SEARCH_INPUT_MAX_LIMIT,
  GQL_GET_CONSUMERS_PAGE_QUERY,
} from './consumers.constants';

/* Utility */
import { useQueryParams } from 'common/hooks/useQueryParams';
import { getHumanReadableDate, validateEmail } from 'common/utility';
import {
  areQueryParamsValidAndFixConsumersPageQueryParams,
  getDefaultSearchFieldMessageConsumersPage,
  getSearchFieldMessageConsumersPage,
} from './consumers.utility';
import { AppContext } from 'App';

/* Styles */
import './consumers.page.scss';

/* Assets */
import SearchForConsumersImg from 'assets/images/no-items-image.svg';
import NoConsumersFoundImg from 'assets/images/no-consumers-found.svg';

export const ConsumersPage: FunctionComponent = () => {
  /* App Context */
  const { doesUserHaveRequiredModules } = useContext(AppContext);

  /* Consumers table */
  const [allConsumers, setAllConsumers] = useState<Consumer[] | null>([]);

  /* Consumer profile modal state */
  const [consumerProfileModalState, setConsumerProfileModalState] = useState(false);
  const [editConsumerId, setEditConsumerId] = useState<string | null>(null);

  /* Filter values */
  const [searchTypeFilterValue, setSearchTypeFilterValue] = useState(CONSUMERS_PAGE_QUERY_PARAMS_DEFAULTS.SEARCH_TYPE);
  const [regionFilterValue, setRegionFilterValue] = useState(CONSUMERS_PAGE_QUERY_PARAMS_DEFAULTS.REGION);
  const [searchFilterValue, setSearchFilterValue] = useState('');

  const [isSearchFieldValid, setIsSearchFieldValid] = useState(false);
  const [showSearchValidationMessage, setShowSearchValidationMessage] = useState(false);

  const [searchValueUsed, setSearchValueUsed] = useState('');

  /* Get conusmers query */
  const [
    getConsumers,
    { data: getConsumersData, error: getConsumersError, loading: getConsumersLoading },
  ] = useLazyQuery<GQLGetConsumerPageResult, GQLGetConsumerPageResultVariables>(GQL_GET_CONSUMERS_PAGE_QUERY);

  /* Table */
  const [moreDropdownActiveIndex, setMoreDropdownActiveIndex] = useState(-1);

  /* Query params */
  const { SEARCH, SEARCH_TYPE, REGION } = CONSUMERS_PAGE_QUERY_PARAMS_KEYS;

  const { setQueryParams, queryParams } = useQueryParams<ConsumersPageQueryParams>({
    baseUrlPredefined: ROUTES.CONSUMERS,
    queryParamKeys: [SEARCH, SEARCH_TYPE, REGION],
  });

  /* Table props */
  const onMoreDropdownClick = (index: number) => {
    setMoreDropdownActiveIndex(index === moreDropdownActiveIndex ? -1 : index);
  };

  const getDateReadable = (inputDate: any) => {
    const date = getHumanReadableDate(inputDate);
    return date;
  };

  const onEditUserAction = (consumerId: string) => {
    setEditConsumerId(consumerId);
    setConsumerProfileModal(true)();
  };

  const onSuspendActivateUserAction = (consumerId: string) => {
    // TODO: add suspend/activate action
    console.log(`Suspend/activate action for consumer with id:${consumerId}.`);
  };

  const renderName: TableColumnRenderElement<Consumer> = ({ data }) => {
    return (
      <>
        <Flex.Layout flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex.Item>
            <UserAvatar
              email={data.email}
              firstName={data.givenName}
              isUserActive={data.userStatus === CONSUMER_STATUSES.ACTIVE}
              lastName={data.familyName}
            ></UserAvatar>
          </Flex.Item>
          <Flex.Item flexGrow={2}>
            <Text
              bold={data.userStatus === CONSUMER_STATUSES.ACTIVE}
              className="consumer-info--name"
              color={data.userStatus === CONSUMER_STATUSES.ACTIVE ? 'primary' : 'secondary1'}
            >
              {data.fullName ?? 'Not Available Yet'}
            </Text>
          </Flex.Item>
        </Flex.Layout>
      </>
    );
  };

  const renderEmail: TableColumnRenderElement<Consumer> = ({ data }) => {
    return (
      <>
        <Flex.Layout alignItems="center">
          <Text
            className="consumer-info--email"
            color={data.userStatus === CONSUMER_STATUSES.ACTIVE ? 'primary' : 'secondary1'}
          >
            {data.email}
          </Text>
        </Flex.Layout>
      </>
    );
  };

  const renderPhoneNumber: TableColumnRenderElement<Consumer> = ({ data }) => {
    return (
      <>
        <Flex.Layout alignItems="center">
          <Text className="consumer-info--phone-number">{data.phoneNumber}</Text>
        </Flex.Layout>
      </>
    );
  };

  const renderStatus: TableColumnRenderElement<Consumer> = ({ data }) => {
    let status = 'Undefined';
    let color = CONSUMER_STATUS_COLOR.UNDEFINED;
    switch (data.userStatus) {
      case CONSUMER_STATUSES.ACTIVE:
        status = 'Active';
        color = CONSUMER_STATUS_COLOR.ACTIVE;
        break;
      case CONSUMER_STATUSES.SUSPENDED:
        status = 'Suspended';
        color = CONSUMER_STATUS_COLOR.SUSPENDED;
        break;
      case CONSUMER_STATUSES.PENDING_SIGN_UP:
        status = 'Pending Sign Up';
        color = CONSUMER_STATUS_COLOR.PENDING_SIGN_UP;
        break;
    }
    return (
      <Flex.Layout className="consumer-status-wrapper" alignItems="center">
        <Chip color={color} bottomSpacing={false} rightSpacing={false}>
          {status}
        </Chip>
      </Flex.Layout>
    );
  };

  const renderUpdated: TableColumnRenderElement<Consumer> = ({ data }) => (
    <span>{getDateReadable(data.lastModifiedDate)}</span>
  );

  const renderOptions: TableColumnRenderElement<Consumer> = ({ data, index }) => {
    const moreOptions: DropdownOption[] = [];

    if (doesUserHaveRequiredModules(CONSUMERS_USER_MODULE_OWNER)) {
      moreOptions.push({
        name: 'Edit User',
        value: data,
        action: (optionData: Consumer) => onEditUserAction(`${optionData.id}`),
      });
      moreOptions.push({
        name: 'Suspend User',
        value: data,
        action: (optionData: Consumer) => onSuspendActivateUserAction(`${optionData.id}`),
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
      className: 'consumers__email-column-cell',
    },
    {
      title: 'Phone Number',
      titleTextAlign: 'left',
      renderElement: renderPhoneNumber,
      columnAlignContent: 'flex-start',
      className: 'consumers__phone-number-column-cell',
    },
    {
      title: 'Status',
      titleTextAlign: 'left',
      renderElement: renderStatus,
      columnAlignContent: 'flex-start',
    },
    {
      title: 'Updated',
      titleTextAlign: 'left',
      renderElement: renderUpdated,
      columnAlignContent: 'flex-start',
    },
    { title: '', renderElement: renderOptions },
  ];

  /* Filters */
  const onSearchTypeChange: SelectOnChange = (data) => {
    const searchTypeValue = data.target.value as ConsumersPageSearchTypeQueryParam;

    setIsSearchFieldValid(true);

    setQueryParams({
      params: [
        {
          name: CONSUMERS_PAGE_QUERY_PARAMS_KEYS.SEARCH_TYPE,
          value: searchTypeValue,
        },
      ],
      clearParams: [CONSUMERS_PAGE_QUERY_PARAMS_KEYS.SEARCH],
    });
  };

  const onRegionChange: SelectOnChange = (data) => {
    const regionValue = data.target.value as ConsumersPageRegionQueryParam;

    setQueryParams({
      params: [
        {
          name: CONSUMERS_PAGE_QUERY_PARAMS_KEYS.REGION,
          value: regionValue,
        },
      ],
    });
  };

  /* Search filter */
  const setSearchFieldValidState = ({
    search,
    searchType,
  }: {
    search: string;
    searchType: ConsumersPageSearchTypeQueryParam;
  }) => {
    if (search && searchType === 'email' && !validateEmail(search)) {
      setIsSearchFieldValid(false);
      return false;
    } else if (!isSearchFieldValid) {
      setIsSearchFieldValid(true);
      return true;
    }

    return true;
  };

  const onConsumerSearchChange: OnInputChange = (event) => {
    const searchValue = event.target.value;

    setSearchFieldValidState({
      search: searchValue,
      searchType: searchTypeFilterValue,
    });

    setShowSearchValidationMessage(false);

    setSearchFilterValue(searchValue);

    setQueryParams({
      params: [
        {
          name: CONSUMERS_PAGE_QUERY_PARAMS_KEYS.SEARCH,
          value: searchValue,
        },
      ],
    });
  };

  const onConsumerSearchTriggered = () => {
    setShowSearchValidationMessage(true);
    getConsumersCall({ searchValid: isSearchFieldValid });
  };

  /* Set filters values from query params */
  const setFilterValuesFromQueryParams = (queryParameters: ConsumersPageQueryParams) => {
    if (queryParameters.searchType && queryParameters.searchType !== searchTypeFilterValue) {
      setSearchTypeFilterValue(queryParameters.searchType);
    }

    if (queryParameters.region && queryParameters.region !== regionFilterValue) {
      setRegionFilterValue(queryParameters.region);
    }

    if (queryParameters.search !== searchFilterValue) {
      setSearchFilterValue(queryParameters.search || '');
    }
  };

  /* Consumer profile modal */
  const setConsumerProfileModal = (state: boolean) => () => {
    setConsumerProfileModalState(state);
  };

  /* Get consumers call */
  const getConsumersCall = ({ searchValid }: { searchValid: boolean }) => {
    if (queryParams.search && queryParams.region && searchValid) {
      const gqlQueryVariables: GQLGetConsumerPageResultVariables = {
        userPoolKey: queryParams.region,
      };

      if (queryParams.searchType === 'email') {
        gqlQueryVariables.email = queryParams.search;
      } else if (queryParams.searchType === 'phone') {
        gqlQueryVariables.phoneNumber = `${CONSUMERS_PAGE_REGION_OPTIONS_PAIRS[regionFilterValue]}${queryParams.search}`;
      }

      getConsumers({
        variables: gqlQueryVariables,
      });
    }
  };

  /* Consumers list data hook */
  useEffect(() => {
    if (getConsumersData?.consumerUsersPage?.content && queryParams.search) {
      setSearchValueUsed(queryParams.search);
      setAllConsumers(getConsumersData.consumerUsersPage.content);
    }
  }, [getConsumersData]);

  useEffect(() => {
    if (getConsumersError && queryParams.search) {
      setSearchValueUsed(queryParams.search);
    }
  });

  /* Set consumers title */
  useEffect(() => {
    setCurrentPageTitle(PAGE_NAMES.CONSUMERS);

    if (queryParams.search && queryParams.searchType) {
      const isSearchValid = setSearchFieldValidState({
        search: queryParams.search,
        searchType: queryParams.searchType,
      });

      setShowSearchValidationMessage(true);

      getConsumersCall({ searchValid: isSearchValid });
    }
  }, []);

  /* Query params hook */
  useEffect(() => {
    if (areQueryParamsValidAndFixConsumersPageQueryParams({ queryParams, setQueryParams })) {
      // Set states from query params
      setFilterValuesFromQueryParams(queryParams);

      // Get consumers
      getConsumersCall({ searchValid: isSearchFieldValid });
    }
  }, [queryParams.searchType, queryParams.region]);

  return (
    <PageContainer flex>
      <Loader loaderFlag={getConsumersLoading} />

      <PageHeader title={PAGE_NAMES.CONSUMERS}></PageHeader>
      <PageFilters>
        <Flex.Layout alignItems="flex-start">
          {/* Search type filter */}
          <Select
            className="consumers__search-type-dropdown"
            id="consumers-page-search-type-dropdown"
            onChange={onSearchTypeChange}
            value={searchTypeFilterValue}
          >
            {CONSUMERS_PAGE_SEARCH_TYPE_DROPDOWN_OPTIONS.map((menuOption) => (
              <MenuItem value={menuOption.value} key={menuOption.value}>
                {menuOption.name}
              </MenuItem>
            ))}
          </Select>

          {/* Region filter */}
          <Select
            className="consumers__region-dropdown"
            id="consumers-page-region-dropdown"
            onChange={onRegionChange}
            value={regionFilterValue}
          >
            {CONSUMERS_PAGE_REGION_DROPDOWN_OPTIONS.map((menuOption) => (
              <MenuItem value={menuOption.value} key={menuOption.value}>
                {`${menuOption.name} ${
                  searchTypeFilterValue === CONSUMERS_PAGE_SEARCH_TYPE_QUERY_PARAM_VALUES.PHONE
                    ? ` (${CONSUMERS_PAGE_REGION_OPTIONS_PAIRS[regionFilterValue]})`
                    : ''
                }`}
              </MenuItem>
            ))}
          </Select>

          {/* Email field */}
          <FormInput
            className={classnames({
              'consumers__search-input-field--email':
                searchTypeFilterValue === CONSUMERS_PAGE_SEARCH_TYPE_QUERY_PARAM_VALUES.EMAIL,
            })}
            defaultMessage={getDefaultSearchFieldMessageConsumersPage(searchTypeFilterValue)}
            id="consumers-page-search-input-field"
            maxLength={CONSUMERS_SEARCH_INPUT_MAX_LIMIT}
            message={getSearchFieldMessageConsumersPage({
              searchType: searchTypeFilterValue,
              isSearchFieldValid,
              showSearchValidationMessage,
            })}
            name="search-consumers"
            onBlur={onConsumerSearchTriggered}
            onChange={onConsumerSearchChange}
            onlyNumber={searchTypeFilterValue === CONSUMERS_PAGE_SEARCH_TYPE_QUERY_PARAM_VALUES.PHONE}
            placeholder="Search"
            type="search"
            value={searchFilterValue}
            onKeyPress={(event: OnInputKeyboardEvent) => {
              const keyPressedCode = event.key;

              if (keyPressedCode === INPUT_KEYBOARD_KEYS.ENTER) {
                setShowSearchValidationMessage(true);
                getConsumersCall({ searchValid: isSearchFieldValid });
              }
            }}
          />
        </Flex.Layout>
      </PageFilters>
      <PageContent className="consumers-page__page-content" scrollable>
        {/* Consumers table */}
        {!getConsumersLoading && allConsumers?.length ? (
          <Table className="consumers-table" columns={tableColumns} rows={allConsumers} />
        ) : null}

        {/* No consumers found */}
        {!allConsumers?.length && searchValueUsed ? (
          <Flex.Layout
            alignItems="center"
            className="consumers-table-placeholder"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Flex.Item flexGrow={1}>
              <Image src={NoConsumersFoundImg} />
            </Flex.Item>
            <Flex.Item>
              <Heading className="consumers-table-placeholder_heading" type={4}>
                'MobilePhone/Email’ not found
              </Heading>
            </Flex.Item>
            <Flex.Item flexGrow={1}>
              <Paragraph className="consumers-table-placeholder_text">
                We cannot find the 'MobilePhone/Email’,
                <br /> because it does not exist or system.
              </Paragraph>
            </Flex.Item>
          </Flex.Layout>
        ) : null}

        {/* Initial search consumers screen */}
        {!allConsumers?.length && !searchValueUsed ? (
          <Flex.Layout
            alignItems="center"
            className="consumers-table-placeholder"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Flex.Item flexGrow={1}>
              <Image src={SearchForConsumersImg} />
            </Flex.Item>
            <Flex.Item>
              <Heading className="consumers-table-placeholder_heading" type={4}>
                Search for users!
              </Heading>
            </Flex.Item>
            <Flex.Item flexGrow={1}>
              <Paragraph className="consumers-table-placeholder_text">Before you can manage users,</Paragraph>
              <Paragraph className="consumers-table-placeholder_text">use search by email or phone number.</Paragraph>
            </Flex.Item>
          </Flex.Layout>
        ) : null}
      </PageContent>
      <ConsumerProfileModal
        consumerId={editConsumerId}
        modalState={consumerProfileModalState}
        setModalState={setConsumerProfileModal}
        onConsumerUpdate={onConsumerSearchTriggered}
      />
    </PageContainer>
  );
};
