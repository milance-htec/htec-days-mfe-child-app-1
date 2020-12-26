import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';

import { Modal } from '../modal.component';

afterEach(cleanup);

const testClass = 'modal-class';
const testId = 'modal';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Modal showModal />, div);
});

it('Renders component style, class name and children correctly', () => {
  const { getByTestId } = render(<Modal showModal className={testClass} style={{ marginRight: '10px' }}></Modal>);

  expect(getByTestId(testId)).toHaveClass(testClass);
  expect(getByTestId(testId)).toHaveStyle('margin-right: 10px');
});
