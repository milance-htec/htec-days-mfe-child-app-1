import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Components */
import { ItemHolder, UserAvatar, Text, Radio } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Constants */
import { MODULE_PERMISION_LEVEL_VALUES } from 'components/pages/roles/roles.constants';

/* Types */
import { RoleModulesAccordionContentProps } from './role-modules-accordion-content.types';

/* Styles */
import './role-modules-accordion-content.scss';

export const RoleModulesAccordionContent: FunctionComponent<RoleModulesAccordionContentProps> = ({
  module,
  onPermissionClick,
  className,
  style,
  parentModule = null,
  isAccordion = false,
  paddingValue = 0,
  radioButtonsDisabled = false,
  isSubmodule = false,
  moduleIndex = 0,
}) => {
  const avatarColorArray = ['primary', 'united-nations', 'info', 'success'];
  return (
    <Flex.Layout
      data-testid="role-modules-accordion-content"
      alignItems="center"
      className={classnames('role-modules-accordion-content', className, {
        'manage_modal__accordion-content': isAccordion,
      })}
      style={style}
    >
      <Flex.Layout
        style={{ padding: `0 0 0 ${isSubmodule && !isAccordion ? paddingValue + 1 : 1}rem` }}
        alignItems="center"
        className="role-modules-accordion-content__data--name"
      >
        {!parentModule ? (
          <UserAvatar
            firstName={module.name.split(' ')[0]}
            lastName={module.name.split(' ')[1]}
            isUserActive={true}
            className={classnames(
              'module-avatar',
              `module-avatar--${avatarColorArray[moduleIndex % avatarColorArray.length]}`,
            )}
          />
        ) : null}
        <Text className="module-avatar-name" color="primary" bold={!parentModule}>
          {module.name}{' '}
        </Text>
      </Flex.Layout>
      <Flex.Item className="role-modules-accordion-content__data--status">
        {!isSubmodule ? (
          <>
            {`${module.numberOfModules | 0} Modules /`} <br></br>
            {`${module.numberOfAssignedModules | 0} Assigned  `}
          </>
        ) : null}
      </Flex.Item>
      <Flex.Item
        // style={{ padding: `0 ${isSubmodule && isAccordion ? paddingValue - 1 : 0}rem 0 0 ` }}
        className="role-modules-accordion-content__data--no-access"
      >
        <ItemHolder>
          <Radio
            group={module.id.toString()}
            onChange={onPermissionClick(module.id)}
            checked={module.permissionLevel === MODULE_PERMISION_LEVEL_VALUES.NO_ACCESS}
            value={MODULE_PERMISION_LEVEL_VALUES.NO_ACCESS}
            disabled={
              radioButtonsDisabled
                ? radioButtonsDisabled
                : parentModule?.permissionLevel === MODULE_PERMISION_LEVEL_VALUES.NO_ACCESS
            }
          />
        </ItemHolder>
      </Flex.Item>
      <Flex.Item
        // style={{ padding: `0 ${isSubmodule && isAccordion ? paddingValue - 1 : 0}rem 0 0 ` }}
        className="role-modules-accordion-content__data--viewer"
      >
        <ItemHolder>
          <Radio
            group={module.id.toString()}
            onChange={onPermissionClick(module.id)}
            checked={module.permissionLevel === MODULE_PERMISION_LEVEL_VALUES.VIEWER}
            value={MODULE_PERMISION_LEVEL_VALUES.VIEWER}
            disabled={
              radioButtonsDisabled
                ? radioButtonsDisabled
                : parentModule?.permissionLevel === MODULE_PERMISION_LEVEL_VALUES.NO_ACCESS
            }
          />
        </ItemHolder>
      </Flex.Item>
      <Flex.Item
        // style={{ padding: `0 ${isSubmodule && isAccordion ? paddingValue - 1 : 0}rem 0 0 ` }}
        className="role-modules-accordion-content__data--owner"
      >
        <ItemHolder>
          <Radio
            group={module.id.toString()}
            onChange={onPermissionClick(module.id)}
            checked={module.permissionLevel === MODULE_PERMISION_LEVEL_VALUES.OWNER}
            value={MODULE_PERMISION_LEVEL_VALUES.OWNER}
            disabled={
              radioButtonsDisabled
                ? radioButtonsDisabled
                : parentModule?.permissionLevel === MODULE_PERMISION_LEVEL_VALUES.NO_ACCESS ||
                  parentModule?.permissionLevel === MODULE_PERMISION_LEVEL_VALUES.VIEWER
            }
          />
        </ItemHolder>
      </Flex.Item>
    </Flex.Layout>
  );
};
