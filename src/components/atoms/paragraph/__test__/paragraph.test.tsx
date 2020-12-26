import React from 'react';
import ReactDOM from 'react-dom';
import { Paragraph } from '../paragraph.component';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Paragraph></Paragraph>, div);
});

it('Renders paragraph correctly', () => {
  const { getByTestId } = render(
    <Paragraph style={{ marginRight: '10px' }} className="paragraph-class">
      Paragraph text
    </Paragraph>,
  );
  expect(getByTestId('paragraph')).toHaveTextContent('Paragraph text');
  expect(getByTestId('paragraph')).toHaveClass('paragraph-class');
  expect(getByTestId('paragraph')).toHaveStyle('margin-right: 10px');
});
