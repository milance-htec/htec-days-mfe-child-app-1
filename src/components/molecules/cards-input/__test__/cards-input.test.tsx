import React from 'react';
import { cleanup } from '@testing-library/react';
import { CardsInput } from '../cards-input.component';
import { mount } from 'enzyme';
import { findByTestId } from 'common/test-utility';

afterEach(cleanup);

const testClass = 'cards-input-class';
const testStyle = { marginRight: '10px' };
const testCards = [{ type: 'blue', data: 'Test Card' }];
const cardsInputTestId = 'cards-input';
const cardsInputIconTestId = 'icon';
const cardsInputInputTestId = 'form-input-text';
const cardsInputFromInputTestId = 'cards-input-form-input';

const getWrapper = (
  cards: any[],
  getCardContent: (testParam: any) => any,
  onInputValueTriggered: () => void,
  onRemoveCardClick?: () => void,
  triggerInputValueEmitKeys?: string | string[],
  triggerOnBlur?: boolean,
) => {
  return mount(
    <CardsInput
      cards={cards}
      getCardContent={getCardContent}
      onInputValueTriggered={onInputValueTriggered}
      onRemoveCardClick={onRemoveCardClick}
      triggerInputValueEmitKeys={triggerInputValueEmitKeys}
      triggerOnBlur={triggerOnBlur}
      className={testClass}
      style={testStyle}
    />,
  );
};

it('Renders without crashing', () => {
  const getCardContent = jest.fn((testCards: any) => {
    return { title: 'Test', avatarImage: 'Test', avatarTitle: 'Test' };
  });
  const onInputValueTriggered = jest.fn(() => {});
  const cardsInput = findByTestId(getWrapper(testCards, getCardContent, onInputValueTriggered), cardsInputTestId);

  expect(cardsInput.hasClass(testClass)).toBeTruthy();
  expect(cardsInput.prop('style')).toEqual(testStyle);
});

it('Renders cards input with onRemoveClick prop', () => {
  const getCardContent = jest.fn(() => {
    return { title: 'Test', avatarImage: 'Test', avatarTitle: 'Test' };
  });
  const onInputValueTriggered = jest.fn(() => {});
  const onRemoveCardClick = jest.fn(() => {});
  const icon = findByTestId(
    getWrapper(testCards, getCardContent, onInputValueTriggered, onRemoveCardClick),
    cardsInputIconTestId,
  );
  icon.simulate('click');
  expect(onRemoveCardClick).toBeCalled();
});

it('Renders cards input with input key press', () => {
  const getCardContent = jest.fn(() => {
    return { title: 'Test', avatarImage: 'Test', avatarTitle: 'Test' };
  });
  const onInputValueTriggered = jest.fn(() => {});
  const triggerInputValueEmitKeys = 'Shift';
  const input = findByTestId(
    getWrapper(testCards, getCardContent, onInputValueTriggered, undefined, triggerInputValueEmitKeys),
    cardsInputInputTestId,
  );
  input.simulate('keypress', { key: 'Shift' });
  expect(onInputValueTriggered).toBeCalled();
});

it('Renders cards input with input key down', () => {
  const getCardContent = jest.fn(() => {
    return { title: 'Test', avatarImage: 'Test', avatarTitle: 'Test' };
  });
  const onInputValueTriggered = jest.fn(() => {});
  const triggerInputValueEmitKeys = 'Tab';
  const input = findByTestId(
    getWrapper(testCards, getCardContent, onInputValueTriggered, undefined, triggerInputValueEmitKeys),
    cardsInputInputTestId,
  );
  input.simulate('change', { target: { value: 'Test' } });
  input.simulate('keydown', { key: 'Tab' });
  expect(onInputValueTriggered).toBeCalled();
});

it('Renders cards input with on input blur', () => {
  const getCardContent = jest.fn(() => {
    return { title: 'Test', avatarImage: 'Test', avatarTitle: 'Test' };
  });
  const onInputValueTriggered = jest.fn(() => {});
  const input = findByTestId(
    getWrapper(testCards, getCardContent, onInputValueTriggered, undefined, undefined, true),
    cardsInputInputTestId,
  );
  input.simulate('focus');
  input.simulate('blur');
});

it('Renders cards input with input on change event', () => {
  const getCardContent = jest.fn(() => {
    return { title: 'Test', avatarImage: 'Test', avatarTitle: 'Test' };
  });
  const onInputValueTriggered = jest.fn(() => {});
  const wrapper = getWrapper(testCards, getCardContent, onInputValueTriggered);
  const input = findByTestId(wrapper, cardsInputInputTestId);
  input.simulate('change');
});

// TODO: add useEffect test
