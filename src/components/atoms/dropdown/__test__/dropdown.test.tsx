import React from 'react';
import ReactDOM from 'react-dom';
import { Dropdown } from '../dropdown.component';
import { render, cleanup } from '@testing-library/react';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'dropdown-class';
const testStyle = { marginRight: '10px' };

const getWrapper = (
  showDropdown: boolean,
  hideHandler?: any,
  options?: any,
  footerOptions?: any,
  outerElement?: boolean,
) => {
  return mount(
    outerElement ? (
      <div data-testid="outer-element-test">
        <Dropdown
          onDropdownHide={hideHandler}
          showDropdown={showDropdown}
          options={options}
          footerOptions={footerOptions}
        />
      </div>
    ) : (
      <Dropdown
        onDropdownHide={hideHandler}
        showDropdown={showDropdown}
        options={options}
        footerOptions={footerOptions}
      />
    ),
  );
};

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Dropdown showDropdown={true}></Dropdown>, div);
});

it('Renders dropdown with style and className correctly', () => {
  const { getByTestId } = render(<Dropdown className={testClass} showDropdown={true} style={testStyle} />);
  expect(getByTestId('dropdown')).toHaveClass(testClass);
  expect(getByTestId('dropdown')).toHaveStyle(testStyle);
});

it('Renders dropdown with footer options correctly', () => {
  const footer = [{ action: () => {}, name: 'test', value: 5 }];
  const div = document.createElement('div');
  ReactDOM.render(<Dropdown showDropdown={true} footerOptions={footer} />, div);
});

it('Renders dropdown with options correctly', () => {
  const options = [{ action: () => {}, name: 'test', value: 5 }];
  const div = document.createElement('div');
  ReactDOM.render(<Dropdown showDropdown={true} options={options} />, div);
});

it('Emit hide handler on footer option click', () => {
  const footerOptions = [{ action: () => {}, name: 'test', value: 5 }];
  const hideHandler = jest.fn(() => {});
  const footer = findByTestId(getWrapper(true, hideHandler, null, footerOptions), 'dropdown-footer-option-0');
  footer.simulate('click');
  expect(hideHandler).toBeCalled();
});

it('Emit hide handler on option click', () => {
  const options = [{ action: () => {}, name: 'test', value: 5 }];
  const hideHandler = jest.fn(() => {});
  const footer = findByTestId(getWrapper(true, hideHandler, options), 'dropdown-option-0');
  footer.simulate('click');
  expect(hideHandler).toBeCalled();
});
