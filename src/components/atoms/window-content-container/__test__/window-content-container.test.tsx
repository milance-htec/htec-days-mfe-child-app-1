import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import { WindowContentContainer } from '../window-content-container.component';

afterEach(cleanup);

const testClass = 'window-content-container-class';
const testId = 'window-content-container';
const testChildContent = 'Some content';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WindowContentContainer />, div);
});

it('Renders component style, class name and children correctly', () => {
  const { getByTestId } = render(
    <WindowContentContainer className={testClass} style={{ marginRight: '10px' }}>
      {testChildContent}
    </WindowContentContainer>,
  );

  expect(getByTestId(testId)).toHaveClass(testClass);
  expect(getByTestId(testId)).toHaveStyle('margin-right: 10px');
  expect(getByTestId(testId)).toHaveTextContent(testChildContent);
});
