import React from 'react';
import ReactDOM from 'react-dom';
import { Heading } from '../heading.component';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Heading></Heading>, div);
});

it('Renders heading correctly', () => {
  const { getByTestId } = render(
    <Heading type={2} className="heading">
      Login page
    </Heading>,
  );
  expect(getByTestId('heading-2')).toBeTruthy();
  expect(getByTestId('heading-2')).toHaveTextContent('Login page');
  expect(getByTestId('heading-2')).toHaveClass('heading');
});
