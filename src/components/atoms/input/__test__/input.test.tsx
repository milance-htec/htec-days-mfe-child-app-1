import React from 'react';
import ReactDOM from 'react-dom';
import { Input } from '../input.component';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

const inputName = 'input-name';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Input name={inputName} />, div);
});

it('Renders input correctly', () => {
  const { getByTestId } = render(
    <Input className="input-class" name={inputName} style={{ marginRight: '10px' }} value="Input value" />,
  );

  expect(getByTestId('input')).toHaveAttribute('value', 'Input value');
  expect(getByTestId('input')).toHaveAttribute('name', inputName);
  expect(getByTestId('input')).toHaveClass('input-class');
  expect(getByTestId('input')).toHaveStyle('margin-right: 10px');
});
