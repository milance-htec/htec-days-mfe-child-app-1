import React, { FunctionComponent, useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useDebouncedCallback } from 'use-debounce';
import { FiberManualRecord } from '@material-ui/icons';

import { useReefCloud } from '@reef-tech/reef-cloud-auth';

/* Components */
import { Modal, Button, Icon, MessageBox } from 'components/atoms';
import { Flex, CardsInput, InputSelect } from 'components/molecules';

/* Types and constants */
import { CardInputContent, CardLabelItem } from 'components/molecules/cards-input/cards-input.types';
import {
  GQLFindOrganizationUserByEmailResult,
  GQLFindOrganizationUserByEmailVariables,
  GQLGetRolesForInviteOrganizationUsersResult,
  GQLGetRolesForInviteOrganizationUsersVariables,
  GQLInviteOrganizationUsersResult,
  GQLInviteOrganizationUsersVariables,
  InviteOrganizationUsersModalProps,
  InviteUserRole,
  UserEmailItem,
} from './invite-organization-users.types';
import { InputSelectOption } from 'components/molecules/input-select/input-select.types';

import {
  EMAIL_CARDS_INPUT_ELEMENTS_LIMIT,
  GQL_FIND_ORGANIZATION_USER_BY_EMAIL_QUERY,
  GQL_GET_ROLES_FOR_INVITE_ORGANIZATION_USERS_QUERY,
  GQL_INVITE_ORGANIZATION_USERS_MUTATION,
  GET_ROLES_TIMEOUT_DEBOUNCE,
  ROLES_PAGE_SIZE_DEFAULT,
  ROLES_PAGE_NUMBER_DEFAULT,
} from './invite-organization-users.constants';
import { USER_STATUSES, INPUT_KEYBOARD_KEYS } from 'common/constants';

/* Services and utils */
import { validateEmail } from 'common/utility';

/* Styles */
import './invite-organization-users.scss';
import { FormInputMessage } from 'components/molecules/form-input/form-input.types';

export const InviteOrganizationUsersModal: FunctionComponent<InviteOrganizationUsersModalProps> = (props) =>
  props.modalState ? <ModalBody {...props} /> : null;

const ModalBody: FunctionComponent<InviteOrganizationUsersModalProps> = ({
  setModalState,
  onInviteOrganizationUsersDone,
  setLoaderState,
}) => {
  const { userOrganizationId } = useReefCloud();

  const [userEmailCards, setUserEmailCards] = useState<CardLabelItem<UserEmailItem>[]>([]);
  const [invalidEmailPresent, setInvalidEmailPresent] = useState(false);
  const [rolesAsOptions, setRolesAsOptions] = useState<InputSelectOption<InviteUserRole>[]>([]);
  const [selectedRole, setSelectedRole] = useState<InviteUserRole | null>();
  const [selectRoleInputValue, setSelectRoleInputValue] = useState('');
  const [inviteUserModalRolesPage, setInviteUserModalRolesPage] = useState(0);
  const [inviteUserModalRolesTotalPage, setInviteUserModalRolesTotalPage] = useState(0);

  /* GraphQL calls */
  const [
    findOrganizationUserByEmail,
    { data: foundOrganizationUserByEmailData, loading: foundOrganizationUserByEmailLoading },
  ] = useLazyQuery<GQLFindOrganizationUserByEmailResult, GQLFindOrganizationUserByEmailVariables>(
    GQL_FIND_ORGANIZATION_USER_BY_EMAIL_QUERY,
  );

  const [
    getRolesForInviteOrganizationUsersInputSelect,
    {
      data: getRolesForInviteOrganizationUsersInputSelectData,
      loading: getRolesForInviteOrganizationUsersInputSelectLoading,
    },
  ] = useLazyQuery<GQLGetRolesForInviteOrganizationUsersResult, GQLGetRolesForInviteOrganizationUsersVariables>(
    GQL_GET_ROLES_FOR_INVITE_ORGANIZATION_USERS_QUERY,
  );

  const [
    inviteOrganizationUsers,
    { data: inviteOrganizationUsersData, loading: inviteOrganizationUsersLoading },
  ] = useMutation<GQLInviteOrganizationUsersResult, GQLInviteOrganizationUsersVariables>(
    GQL_INVITE_ORGANIZATION_USERS_MUTATION,
  );

  const getRolesForInviteOrganizationUsersInputSelectWithDebounce = useDebouncedCallback(
    getRolesForInviteOrganizationUsersInputSelect,
    GET_ROLES_TIMEOUT_DEBOUNCE,
  );

  /* Component logic */
  const getEmailCardsInputValidationMessage = () => {
    let inputMessage: FormInputMessage;

    if (invalidEmailPresent) {
      inputMessage = {
        message: 'Check your email entries',
        type: 'error',
      };
    } else {
      inputMessage = {
        message: `Add up to 25 emails (${userEmailCards.length}/25)`,
      };
    }

    return inputMessage;
  };

  const getInviteUsersButtonDisableState = () => {
    return (
      foundOrganizationUserByEmailLoading ||
      invalidEmailPresent ||
      inviteOrganizationUsersLoading ||
      userEmailCards.length === 0 ||
      !selectedRole
    );
  };

  const getCloseButtonDisabledState = () => {
    return foundOrganizationUserByEmailLoading || inviteOrganizationUsersLoading;
  };

  /* Invite organization users */
  const inviteOrganizationUsersOnSubmit = () => {
    const filteredDuplicateEmail = userEmailCards.reduce((accumulator, current) => {
      const duplicateFound = accumulator.find((item) => {
        return (
          item.data.email &&
          current.data.email &&
          item.data.email.toLowerCase() === current.data.email.toLocaleLowerCase()
        );
      });

      if (!duplicateFound) {
        accumulator.push(current);
      }

      return accumulator;
    }, [] as CardLabelItem<UserEmailItem>[]);

    const emailsToSend = filteredDuplicateEmail.map(({ data: { email, username } }) => ({ email, username }));

    const queryVariables: GQLInviteOrganizationUsersVariables = {
      usersList: emailsToSend,
      organizationId: userOrganizationId ? parseInt(userOrganizationId) : 0,
      roleId: selectedRole ? parseInt(selectedRole.id) : 0,
    };

    inviteOrganizationUsers({
      variables: queryVariables,
    });
  };

  const onRoleInputSelectOptionClick = (value: InputSelectOption<InviteUserRole> | null) => {
    if (value) {
      setSelectedRole(value.value);
      setSelectRoleInputValue(value.title);
    }
  };

  /* Cards */
  const onCardInputValueTriggered = (inputValue: string) => {
    if (inputValue && inputValue.length) {
      let formattedEmail = '';

      formattedEmail = inputValue.trim();

      const isEmailValid = validateEmail(formattedEmail);

      let newItem: CardLabelItem<UserEmailItem>;

      if (!isEmailValid) {
        newItem = {
          type: 'error',
          data: {
            email: formattedEmail,
          },
        };

        setInvalidEmailPresent(true);
      } else {
        newItem = {
          type: 'light-blue',
          data: {
            email: formattedEmail,
          },
        };

        findOrganizationUserByEmail({
          variables: {
            email: formattedEmail,
            organizationId: userOrganizationId ? parseInt(userOrganizationId) : 0,
          },
        });
      }

      setUserEmailCards((oldValues) => [...oldValues, newItem]);
    }
  };

  const removeCard = (card: UserEmailItem, index: number) => {
    const newUserEmailCards = [...userEmailCards];

    newUserEmailCards.splice(index, 1);
    setUserEmailCards(newUserEmailCards);

    const anyEmailsInvalid = newUserEmailCards.some((emailItem) => emailItem.type === 'error');
    setInvalidEmailPresent(anyEmailsInvalid);
  };

  const getUserCardText = (item: CardLabelItem<UserEmailItem>): CardInputContent => {
    const { name, email } = item.data;
    return {
      title: name || email,
      avatarTitle: name,
    };
  };

  /* Role selected */
  const onSelectRoleInputChange = (value: string) => {
    setSelectRoleInputValue(value);
    setSelectedRole(null);
    setInviteUserModalRolesPage(0);
  };

  /* on input select list end */
  const getNextPage = () => {
    const newPageNumber = inviteUserModalRolesPage + 1;
    setInviteUserModalRolesPage(newPageNumber);
    getRolesForInviteOrganizationUsersInputSelectWithDebounce.callback({
      variables: {
        organizationId: userOrganizationId ? parseInt(userOrganizationId) : 0,
        name: selectRoleInputValue,
        pageNumber: newPageNumber,
        pageSize: ROLES_PAGE_SIZE_DEFAULT,
      },
    });
  };

  /* Role change hook */
  useEffect(() => {
    getRolesForInviteOrganizationUsersInputSelectWithDebounce.callback({
      variables: {
        organizationId: userOrganizationId ? parseInt(userOrganizationId) : 0,
        name: selectRoleInputValue,
        pageNumber: inviteUserModalRolesPage,
        pageSize: ROLES_PAGE_SIZE_DEFAULT,
      },
    });
    // eslint-disable-next-line
  }, [selectRoleInputValue]);

  /* Modal state hook */
  useEffect(() => {
    getRolesForInviteOrganizationUsersInputSelect({
      variables: {
        organizationId: userOrganizationId ? parseInt(userOrganizationId) : 0,
        pageNumber: ROLES_PAGE_NUMBER_DEFAULT,
        pageSize: ROLES_PAGE_SIZE_DEFAULT,
      },
    });
    // eslint-disable-next-line
  }, []);

  /* Find organization user by email data hook */
  useEffect(() => {
    if (foundOrganizationUserByEmailData) {
      const userRetrievedFromApi = foundOrganizationUserByEmailData.findOrganizationUserByEmail;

      if (userRetrievedFromApi !== null) {
        const newUserEmailCards = [...userEmailCards];

        for (const userEmailCard of newUserEmailCards) {
          if (
            userEmailCard.data.email &&
            userRetrievedFromApi.email &&
            userRetrievedFromApi.userStatus === USER_STATUSES.ACTIVE &&
            userEmailCard.data.email.toLowerCase() === userRetrievedFromApi.email.toLowerCase()
          ) {
            userEmailCard.data.name = userRetrievedFromApi.fullName;
            userEmailCard.data.username = userRetrievedFromApi.username;
            userEmailCard.type = 'blue';
            userEmailCard.tooltip = userEmailCard.data.email;
          } else if (
            userRetrievedFromApi.userStatus === USER_STATUSES.INVITED &&
            userEmailCard.data.email.toLowerCase() === userRetrievedFromApi.email.toLowerCase()
          ) {
            userEmailCard.data.username = userRetrievedFromApi.username;
          }
        }

        setUserEmailCards(newUserEmailCards);
      }
    }
    // eslint-disable-next-line
  }, [foundOrganizationUserByEmailData]);

  /* Invite organization users data hook */
  useEffect(() => {
    if (inviteOrganizationUsersData && selectedRole) {
      onInviteOrganizationUsersDone(inviteOrganizationUsersData.inviteUsers, selectedRole);
    }
    // eslint-disable-next-line
  }, [inviteOrganizationUsersData]);

  /* On roles data change */
  useEffect(() => {
    if (
      getRolesForInviteOrganizationUsersInputSelectData &&
      getRolesForInviteOrganizationUsersInputSelectData.organizationRolesPage &&
      getRolesForInviteOrganizationUsersInputSelectData.organizationRolesPage.content
    ) {
      const { totalPages } = getRolesForInviteOrganizationUsersInputSelectData.organizationRolesPage;

      const newRoles = getRolesForInviteOrganizationUsersInputSelectData.organizationRolesPage.content.map(
        (roleItem) => ({
          value: roleItem,
          title: roleItem.name || '',
        }),
      );

      let optionsForRoles = [];

      if (inviteUserModalRolesPage === 0) {
        optionsForRoles = newRoles;
      } else {
        optionsForRoles = [...rolesAsOptions, ...newRoles];
      }

      setRolesAsOptions(optionsForRoles);
      setInviteUserModalRolesTotalPage(totalPages);
    }
    // eslint-disable-next-line
  }, [getRolesForInviteOrganizationUsersInputSelectData]);

  /* On loading hook */
  useEffect(() => {
    setLoaderState(inviteOrganizationUsersLoading);
    // eslint-disable-next-line
  }, [inviteOrganizationUsersLoading]);

  /* Render */
  return (
    <Modal
      showModal
      // heading={`Invite users to ${userOrganizationData?.name}`}
      heading="Invite users"
      onModalBlur={setModalState(false)}
      closeButtonIconDisabled={getCloseButtonDisabledState()}
      headerCustomContent={
        userEmailCards.length ? (
          <Flex.Layout flex={1} justifyContent="flex-end" alignItems="center">
            <Flex.Layout alignItems="center" className="invite-organization-users__modal-legend-item">
              <Icon className="invite-organization-users__modal-legend-new-users">
                <FiberManualRecord />
              </Icon>{' '}
              New Users
            </Flex.Layout>
            <Flex.Layout alignItems="center" className="invite-organization-users__modal-legend-item">
              <Icon className="invite-organization-users__modal-legend-active-users">
                <FiberManualRecord />
              </Icon>{' '}
              Active Users
            </Flex.Layout>
          </Flex.Layout>
        ) : null
      }
      footer={
        <Flex.Layout justifyContent="flex-end">
          <Button
            id="organization-users-page-invite-organization-users-modal-invite-users-button"
            data-testid="invite-users-button"
            disabled={getInviteUsersButtonDisableState()}
            onClick={inviteOrganizationUsersOnSubmit}
          >
            Invite users
          </Button>
        </Flex.Layout>
      }
    >
      {/* Cards input */}
      <CardsInput
        cards={userEmailCards}
        cardsCountLimit={EMAIL_CARDS_INPUT_ELEMENTS_LIMIT}
        cardsTitle="Enter one or multiple emails to invite"
        className="invite-organization-users-modal__cards-input"
        getCardContent={getUserCardText}
        inputDisabled={invalidEmailPresent}
        inputPlaceholder="Enter one or multiple emails to invite"
        inputValidationMessage={getEmailCardsInputValidationMessage()}
        onInputValueTriggered={onCardInputValueTriggered}
        onRemoveCardClick={removeCard}
        triggerInputValueEmitKeys={[INPUT_KEYBOARD_KEYS.ENTER, INPUT_KEYBOARD_KEYS.TAB, INPUT_KEYBOARD_KEYS.SPACE]}
        triggerOnBlur
      />

      {/* Select role input select */}
      <InputSelect
        placeholder="Search and Select role"
        title="Search and Select role"
        options={rolesAsOptions}
        onOptionSelect={onRoleInputSelectOptionClick}
        onInputChange={onSelectRoleInputChange}
        value={selectRoleInputValue}
        type="input"
        totalPages={inviteUserModalRolesTotalPage}
        currentPage={inviteUserModalRolesPage}
        optionsLoading={getRolesForInviteOrganizationUsersInputSelectLoading}
        onListEnd={getNextPage}
        clearValueIcon
      />

      {/* Message box */}
      {selectedRole ? (
        <MessageBox className="invite-organization-users-modal__info-box">
          Active user will not be added, but chosen role will be assigned
        </MessageBox>
      ) : null}
    </Modal>
  );
};
