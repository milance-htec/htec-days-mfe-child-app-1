import React, { ChangeEvent } from 'react';
import { cleanup } from '@testing-library/react';
import { RoleModulesAccordionContent } from '../role-modules-accordion-content.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

import { Module } from 'components/pages/roles/roles.types';
import { MODULE_PERMISION_LEVEL_VALUES } from 'components/pages/roles/roles.constants';

afterEach(cleanup);

const testClass = 'role-modules-accordion-content-class';
const testStyle = { marginRight: '10px' };
const moduleTest: Module = {
  id: '1',
  name: 'Test name',
  numberOfAssignedModules: 1,
  numberOfModules: 1,
  permissionLevel: MODULE_PERMISION_LEVEL_VALUES.OWNER,
  subModules: [
    {
      id: '2',
      name: 'Test name1',
      numberOfAssignedModules: 0,
      numberOfModules: 0,
      permissionLevel: MODULE_PERMISION_LEVEL_VALUES.OWNER,
      subModules: [],
    },
  ],
};
const parentModuleOwnerTest: Module = {
  id: '3',
  name: 'Test name',
  numberOfAssignedModules: 1,
  numberOfModules: 1,
  permissionLevel: MODULE_PERMISION_LEVEL_VALUES.OWNER,
};
const parentModuleViewerTest: Module = {
  id: '3',
  name: 'Test name',
  numberOfAssignedModules: 1,
  numberOfModules: 1,
  permissionLevel: MODULE_PERMISION_LEVEL_VALUES.OWNER,
};
const parentModuleNoAccessTest: Module = {
  id: '3',
  name: 'Test name',
  numberOfAssignedModules: 1,
  numberOfModules: 1,
  permissionLevel: MODULE_PERMISION_LEVEL_VALUES.OWNER,
};
const roleModulesAccordionContentTestId = 'role-modules-accordion-content';

const getWrapper = (
  onPermissionClick: (moduleId: string) => (e: ChangeEvent<any>) => void,
  parentModule?: Module,
  isSubmodule?: boolean,
) => {
  return mount(
    <RoleModulesAccordionContent
      module={moduleTest}
      onPermissionClick={onPermissionClick}
      parentModule={parentModule}
      isSubmodule={isSubmodule}
      className={testClass}
      style={testStyle}
    />,
  );
};

it('Renders without crashing', () => {
  const onPermissionClick = jest.fn((moduleId: string) => (e: ChangeEvent<any>) => {});
  const roleModulesAccordionContent = findByTestId(getWrapper(onPermissionClick), roleModulesAccordionContentTestId);

  expect(roleModulesAccordionContent.hasClass(testClass)).toBeTruthy();
  expect(roleModulesAccordionContent.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with parent module', () => {
  const onPermissionClick = jest.fn((moduleId: string) => (e: ChangeEvent<any>) => {});
  const roleModulesAccordionContent = findByTestId(
    getWrapper(onPermissionClick, parentModuleOwnerTest),
    roleModulesAccordionContentTestId,
  );

  expect(roleModulesAccordionContent.hasClass(testClass)).toBeTruthy();
  expect(roleModulesAccordionContent.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with parent owner permission level module and submodule', () => {
  const onPermissionClick = jest.fn((moduleId: string) => (e: ChangeEvent<any>) => {});
  const roleModulesAccordionContent = findByTestId(
    getWrapper(onPermissionClick, parentModuleOwnerTest, true),
    roleModulesAccordionContentTestId,
  );

  expect(roleModulesAccordionContent.hasClass(testClass)).toBeTruthy();
  expect(roleModulesAccordionContent.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with parent viewer permission level module and submodule', () => {
  const onPermissionClick = jest.fn((moduleId: string) => (e: ChangeEvent<any>) => {});
  const roleModulesAccordionContent = findByTestId(
    getWrapper(onPermissionClick, parentModuleViewerTest, true),
    roleModulesAccordionContentTestId,
  );

  expect(roleModulesAccordionContent.hasClass(testClass)).toBeTruthy();
  expect(roleModulesAccordionContent.prop('style')).toEqual(testStyle);
});

it('Renders without crashing with parent no access permission level module and submodule', () => {
  const onPermissionClick = jest.fn((moduleId: string) => (e: ChangeEvent<any>) => {});
  const roleModulesAccordionContent = findByTestId(
    getWrapper(onPermissionClick, parentModuleOwnerTest, true),
    roleModulesAccordionContentTestId,
  );

  expect(roleModulesAccordionContent.hasClass(testClass)).toBeTruthy();
  expect(roleModulesAccordionContent.prop('style')).toEqual(testStyle);
});
