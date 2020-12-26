import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import { UserAvatar } from '../user-avatar.component';

afterEach(cleanup);

const testClass = 'user-avatar-class';
const testId = 'user-avatar';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserAvatar />, div);
});

it('Renders component style, class name and children correctly', () => {
  const { getByTestId } = render(<UserAvatar className={testClass} style={{ marginRight: '10px' }} />);

  expect(getByTestId(testId)).toHaveClass(testClass);
  expect(getByTestId(testId)).toHaveStyle('margin-right: 10px');
});
