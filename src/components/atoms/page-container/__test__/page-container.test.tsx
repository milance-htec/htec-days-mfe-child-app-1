import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import { PageContainer } from '../page-container.component';

afterEach(cleanup);

const testClass = 'page-container-class';
const testId = 'page-container';
const testChildContent = 'Some content';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PageContainer />, div);
});

it('Renders component style, class name and children correctly', () => {
  const { getByTestId } = render(
    <PageContainer className={testClass} style={{ marginRight: '10px' }}>
      {testChildContent}
    </PageContainer>,
  );

  expect(getByTestId(testId)).toHaveClass(testClass);
  expect(getByTestId(testId)).toHaveTextContent(testChildContent);
  expect(getByTestId(testId)).toHaveStyle('margin-right: 10px');
});

it('Renders component with scrollable class', () => {
  const { getByTestId } = render(<PageContainer scrollable />);

  expect(getByTestId(testId)).toHaveClass('page-container--scrollable');
});

it('Renders component with flex class', () => {
  const { getByTestId } = render(<PageContainer flex />);

  expect(getByTestId(testId)).toHaveClass('page-container--flex');
});

it('Renders component with flex direction row class', () => {
  const { getByTestId } = render(<PageContainer flexDirection="row" />);

  expect(getByTestId(testId)).toHaveClass('page-container--flex-direction-row');
});

it('Renders component with flex direction column class', () => {
  const { getByTestId } = render(<PageContainer flexDirection="column" />);

  expect(getByTestId(testId)).toHaveClass('page-container--flex-direction-column');
});
