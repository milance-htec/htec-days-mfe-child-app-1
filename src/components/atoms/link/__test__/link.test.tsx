import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from '../link.component';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Link></Link>, div);
});

it('Renders link correctly', () => {
  const { getByTestId } = render(
    <Link href="www.google.com" style={{ marginRight: '10px' }} className="link-class">
      Link text
    </Link>,
  );
  expect(getByTestId('link')).toHaveTextContent('Link text');
  expect(getByTestId('link')).toHaveClass('link-class');
  expect(getByTestId('link')).toHaveStyle('margin-right: 10px');
  expect(getByTestId('link')).toHaveAttribute('href', 'www.google.com');
});
