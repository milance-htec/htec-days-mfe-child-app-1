import React from 'react';
import ReactDOM from 'react-dom';
import { ItemBox } from '../item-box.component';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

const testClass = 'item-box-class';
const testId = 'item-box';
const testChildContent = 'Some content';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ItemBox onActiveChange={() => {}} />, div);
});

it('Renders Item box correctly', () => {
  const { getByTestId } = render(
    <ItemBox className={testClass} isActive onActiveChange={() => {}} style={{ marginRight: '10px' }}>
      {testChildContent}
    </ItemBox>,
  );

  expect(getByTestId(testId)).toHaveClass(testClass);
  expect(getByTestId(testId)).toHaveTextContent(testChildContent);
  expect(getByTestId(testId)).toHaveClass('active');
  expect(getByTestId(testId)).toHaveStyle('margin-right: 10px');
});
