import React from 'react';
import ReactDOM from 'react-dom';
import { Radio } from '../radio.component';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

const radioTestId = 'radio';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Radio checked={false}></Radio>, div);
});

it('Renders radio correctly', () => {
  const { getByTestId } = render(<Radio checked={false} style={{ marginRight: '10px' }} className="radio-class" />);
  expect(getByTestId(radioTestId)).toHaveClass('radio-class');
  expect(getByTestId(radioTestId)).toHaveStyle('margin-right: 10px');
});
