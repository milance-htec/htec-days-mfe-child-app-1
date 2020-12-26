import React from 'react';
import ReactDOM from 'react-dom';
import { HorizontalLine } from '../horizontal-line.component';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<HorizontalLine></HorizontalLine>, div);
});

it('Renders horizontal line correctly', () => {
  const { getByTestId } = render(<HorizontalLine style={{ marginRight: '10px' }} />);
  expect(getByTestId('horizontal-line')).toHaveTextContent('');
  expect(getByTestId('horizontal-line')).toHaveClass('horizontal-line');
  expect(getByTestId('horizontal-line')).toHaveStyle('margin-right: 10px');
});
