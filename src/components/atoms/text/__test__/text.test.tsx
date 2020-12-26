import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import { Text } from '../text.component';

afterEach(cleanup);

const testClass = 'text-class';
const testId = 'text';
const testChildContent = 'Some content';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Text />, div);
});

it('Renders component style, class name and children correctly', () => {
  const { getByTestId } = render(
    <Text className={testClass} style={{ marginRight: '10px' }}>
      {testChildContent}
    </Text>,
  );

  expect(getByTestId(testId)).toHaveClass(testClass);
  expect(getByTestId(testId)).toHaveTextContent(testChildContent);
  expect(getByTestId(testId)).toHaveStyle('margin-right: 10px');
});

it('Renders component text as bold font', () => {
  const { getByTestId } = render(<Text bold />);

  expect(getByTestId(testId)).toHaveClass('text--bold');
});

it('Renders component text as underline font', () => {
  const { getByTestId } = render(<Text underline />);

  expect(getByTestId(testId)).toHaveClass('text--underline');
});

it('Renders component text with cursor pointer', () => {
  const { getByTestId } = render(<Text onClick={() => {}} />);

  expect(getByTestId(testId)).toHaveClass('text--cursor-pointer');
});
