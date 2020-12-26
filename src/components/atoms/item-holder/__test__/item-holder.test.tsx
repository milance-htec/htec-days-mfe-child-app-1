import React from 'react';
import ReactDOM from 'react-dom';
import { render, cleanup } from '@testing-library/react';
import { ItemHolder } from '../item-holder.component';

afterEach(cleanup);

const testClass = 'item-holder-class';
const testId = 'item-holder';
const testChildContent = 'Some content';

it('Renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ItemHolder />, div);
});

it('Renders Item box correctly', () => {
  const { getByTestId } = render(
    <ItemHolder className={testClass} style={{ marginRight: '10px' }} leftSpacing rightSpacing topSpacing bottomSpacing>
      {testChildContent}
    </ItemHolder>,
  );

  expect(getByTestId(testId)).toHaveClass(testClass);
  expect(getByTestId(testId)).toHaveTextContent(testChildContent);
  expect(getByTestId(testId)).toHaveStyle('margin-right: 10px');

  expect(getByTestId(testId)).toHaveClass('item-holder__left-spacing');
  expect(getByTestId(testId)).toHaveClass('item-holder__right-spacing');
  expect(getByTestId(testId)).toHaveClass('item-holder__top-spacing');
  expect(getByTestId(testId)).toHaveClass('item-holder__bottom-spacing');
});
