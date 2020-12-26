import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import { MessageBox } from '../message-box.component';

afterEach(cleanup);

const testClass = 'message-box-class';
const testId = 'message-box';
const testChildContent = 'Some content';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MessageBox />, div);
});

it('Renders component style, class name and children correctly', () => {
  const { getByTestId } = render(
    <MessageBox className={testClass} style={{ marginRight: '10px' }}>
      {testChildContent}
    </MessageBox>,
  );

  expect(getByTestId(testId)).toHaveClass(testClass);
  expect(getByTestId(testId)).toHaveTextContent(testChildContent);
  expect(getByTestId(testId)).toHaveStyle('margin-right: 10px');
});

it('Renders messsage box as info type is rendered correctly', () => {
  const { getByTestId } = render(<MessageBox />);

  expect(getByTestId(testId)).toHaveClass('message-box--info');
});

it('Renders messsage box as error type is rendered correctly', () => {
  const { getByTestId } = render(<MessageBox type="error" />);

  expect(getByTestId(testId)).toHaveClass('message-box--error');
});

it('Renders messsage box as success type is rendered correctly', () => {
  const { getByTestId } = render(<MessageBox type="success" />);

  expect(getByTestId(testId)).toHaveClass('message-box--success');
});
