import React from 'react';
import { cleanup } from '@testing-library/react';
import { Recaptcha } from '../recaptcha.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const recaptchaTestId = 'recaptcha';

const getWrapper = (onChange: () => void) => {
  return mount(<Recaptcha onChange={onChange} siteKey="TEST" />);
};

it('Renders without crashing', () => {
  const onChange = jest.fn(() => {});
  const recaptcha = findByTestId(getWrapper(onChange), recaptchaTestId);
  expect(recaptcha.length).not.toBe(0);
});
