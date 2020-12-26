import React from 'react';
import ReactDOM from 'react-dom';
import { Atom } from '../atom.component';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Atom></Atom>, div);
});

it('Renders atom correctly', () => {
  const { getByTestId } = render(<Atom style={{ marginRight: '10px' }}></Atom>);
  expect(getByTestId('atom')).toHaveTextContent('Text');
  expect(getByTestId('atom')).toHaveClass('atom');
  expect(getByTestId('atom')).toHaveStyle('margin-right: 10px');
});
