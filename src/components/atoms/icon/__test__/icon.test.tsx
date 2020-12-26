import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '../icon.component';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Icon></Icon>, div);
});

it('Renders icon correctly', () => {
  const { getByTestId } = render(<Icon style={{ marginRight: '10px' }}>Text</Icon>);
  expect(getByTestId('icon')).toHaveTextContent('Text');
  expect(getByTestId('icon')).toHaveClass('icon');
  expect(getByTestId('icon')).toHaveStyle('margin-right: 10px');
});
