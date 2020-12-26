import React from 'react';
import ReactDOM from 'react-dom';
import { Image } from '../image.component';
import { render, cleanup } from '@testing-library/react';

afterEach(cleanup);

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Image src="image.png" />, div);
});

it('Renders image correctly', () => {
  const { getByTestId } = render(
    <Image src="image.png" alt="Image alt text" className="image-class" style={{ marginRight: '10px' }} />,
  );
  expect(getByTestId('image')).toHaveAttribute('src', 'image.png');
  expect(getByTestId('image')).toHaveAttribute('alt', 'Image alt text');
  expect(getByTestId('image')).toHaveClass('image-class');
  expect(getByTestId('image')).toHaveStyle('margin-right: 10px');
});
