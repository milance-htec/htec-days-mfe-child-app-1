import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { useLazyQuery } from '@apollo/react-hooks';

/* Components */
import { Icon, Text, UserAvatar } from 'components/atoms';
import { Flex } from 'components/molecules';
import { ProfileTab } from './profile-tab';

/* Types */
import {
  ConsumerProfileModalProps,
  ConsumerProfileModalTabsListKeys,
  ConsumerProfileModalTabListItem,
  GQLGetConsumerDataByIdResult,
  GQLGetConsumerDataByIdVariables,
} from './consumer-profile-modal.types';
import { OnDivElementClick } from 'common/types';
import { Consumer } from 'components/pages/consumers/consumers.types';

/* Constants */
import {
  GQL_GET_CONSUMER_DATA_QUERY,
  USER_PROFILE_MODAL_TABS_LIST,
  USER_PROFILE_MODAL_TABS_LIST_KEYS,
} from './consumer-profile-modal.constants';

/* Styles */
import './consumer-profile-modal.scss';
import { Clear } from '@material-ui/icons';

export const CONSUMER_PROFILE_TEST_ID = 'consumer-profile-modal';

export const ConsumerProfileModal: FunctionComponent<ConsumerProfileModalProps> = (props) =>
  props.modalState ? <ModalBody {...props} /> : null;

export const ModalBody: FunctionComponent<ConsumerProfileModalProps> = ({
  setModalState,
  consumerId,
  onConsumerUpdate,
}) => {
  const parentRef = useRef<any>();

  /* Get consumer data*/
  const [getConsumer, { data: getConsumerData, loading: getConsumerLoading }] = useLazyQuery<
    GQLGetConsumerDataByIdResult,
    GQLGetConsumerDataByIdVariables
  >(GQL_GET_CONSUMER_DATA_QUERY);

  const [consumerData, setConsumerData] = useState<Consumer | null>(null);

  const onConsumerUpdated = () => {
    onConsumerUpdate();
  };

  // Tabs
  const [activeTabKey, setActiveTabKey] = useState<ConsumerProfileModalTabsListKeys>(
    USER_PROFILE_MODAL_TABS_LIST_KEYS.PROFILE,
  );

  const onModalClick: OnDivElementClick = (e) => {
    if (e.target === parentRef.current) {
      onModalClose();
    }
  };

  const onModalClose = () => {
    console.log(setModalState);
    setModalState(false)();
  };

  // Tab control
  const onTabsListItemClick = (key: ConsumerProfileModalTabsListKeys) => () => {
    if (key !== activeTabKey) {
      setActiveTabKey(key);
    }
  };

  const getActiveTab = (activeTabKey: ConsumerProfileModalTabsListKeys) => {
    switch (activeTabKey) {
      case 'profile':
        return <ProfileTab consumer={consumerData} onConsumerUpdated={onConsumerUpdated} />;
    }
  };

  const sidebarTabItemsReduced = USER_PROFILE_MODAL_TABS_LIST.reduce((accumulator, currentValue) => {
    accumulator.push(currentValue);
    return accumulator;
  }, [] as ConsumerProfileModalTabListItem[]);

  useEffect(() => {
    if (consumerId) {
      getConsumer({ variables: { consumerId: consumerId ? parseInt(consumerId) : 0 } });
    }
    // eslint-disable-next-line
  }, [consumerId]);

  useEffect(() => {
    if (getConsumerData?.consumerUserDataById) {
      setConsumerData(getConsumerData?.consumerUserDataById);
    }
    // eslint-disable-next-line
  }, [getConsumerData]);

  return !getConsumerLoading && consumerData ? (
    <div
      data-testid={CONSUMER_PROFILE_TEST_ID}
      className="consumer-profile-modal"
      onClick={onModalClick}
      ref={parentRef}
    >
      <Flex.Layout className="consumer-profile-modal__content">
        {/* Sidebar */}

        <Flex.Layout className="consumer-profile-modal__tabs-sidebar" flexDirection="column">
          {/* Sidebar heading */}

          <Flex.Layout className="consumer-profile-modal-sidebar__heading" alignItems="center">
            <UserAvatar
              email={consumerData?.email}
              firstName={consumerData?.givenName}
              isUserActive
              lastName={consumerData?.familyName}
              fontSize="small"
              className="consumer-profile-modal-sidebar__heading--avatar"
            />

            <Text bold className="consumer-profile-modal-sidebar__heading-title">
              {consumerData?.fullName ? consumerData.fullName : 'Not Yet Available'}
            </Text>
          </Flex.Layout>

          {/* Tabs list */}

          <Flex.Item flexGrow={1} className="consumer-profile-modal-sidebar__tabs-list">
            {sidebarTabItemsReduced.map((listItem) => (
              <div
                className={classnames('consumer-profile-modal-sidebar__tabs-list-item', {
                  'consumer-profile-modal-sidebar__tabs-list-item--active': listItem.key === activeTabKey,
                })}
                key={listItem.key}
                onClick={onTabsListItemClick(listItem.key)}
              >
                {listItem.title}
              </div>
            ))}
          </Flex.Item>
        </Flex.Layout>

        {/* Content */}

        <Flex.Layout className="consumer-profile-modal__tabs-wrapper" flexGrow={1}>
          <Flex.Layout
            alignItems="stretch"
            className="consumer-profile-modal__tab-content-wrapper"
            flex={1}
            flexDirection="column"
          >
            <Icon className="consumer-profile-modal__tab-content-wrapper--close-modal" onClick={onModalClose}>
              <Clear />
            </Icon>
            {getActiveTab(activeTabKey)}
          </Flex.Layout>
        </Flex.Layout>
      </Flex.Layout>
    </div>
  ) : null;
};
