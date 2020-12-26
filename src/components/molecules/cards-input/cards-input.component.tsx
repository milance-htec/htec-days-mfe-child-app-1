import React, { useState, FunctionComponent, useEffect, useRef } from 'react';
import classnames from 'classnames';

/* Components */
import { Text } from 'components/atoms';
import { CardsInputChip, Flex, FormInput } from 'components/molecules';

/* Types */
import { CardsInputProps } from './cards-input.types';
import { OnInputKeyboardEvent, OnInputKeyboard, OnInputChange } from 'common/types';

/* Constants */
import { INPUT_KEYBOARD_KEYS } from 'common/constants';

/* Styles */
import './cards-input.scss';

export const CardsInput: FunctionComponent<CardsInputProps> = ({
  cards,
  cardsCountLimit,
  cardsTitle,
  className,
  getCardContent,
  inputDisabled = false,
  inputPlaceholder,
  inputValidationMessage,
  onInputValueTriggered,
  onRemoveCardClick,
  style,
  triggerInputValueEmitKeys,
  triggerOnBlur = false,
}) => {
  const [valueInput, setValueInput] = useState<string>('');
  const [hidePlaceholder, setHidePlaceholder] = useState(true);
  const inputRef = useRef<any>();

  const onInputKeyPress = (event: OnInputKeyboardEvent) => {
    const keyPressedCode = event.key;

    if (
      triggerInputValueEmitKeys &&
      ((typeof triggerInputValueEmitKeys === 'object' &&
        triggerInputValueEmitKeys.length !== undefined &&
        triggerInputValueEmitKeys.includes(keyPressedCode)) ||
        (typeof triggerInputValueEmitKeys === 'string' && triggerInputValueEmitKeys === keyPressedCode))
    ) {
      onInputValueTriggered(valueInput);
      setValueInput('');
    }
  };

  const onInputKeyDown: OnInputKeyboard = (event) => {
    const keyDown = event.key;

    if (keyDown === INPUT_KEYBOARD_KEYS.TAB) {
      event.preventDefault();

      if (
        triggerInputValueEmitKeys &&
        ((typeof triggerInputValueEmitKeys === 'object' &&
          triggerInputValueEmitKeys.length !== undefined &&
          triggerInputValueEmitKeys.includes(INPUT_KEYBOARD_KEYS.TAB)) ||
          (typeof triggerInputValueEmitKeys === 'string' && triggerInputValueEmitKeys === INPUT_KEYBOARD_KEYS.TAB)) &&
        valueInput !== ''
      ) {
        onInputValueTriggered(valueInput);
        setValueInput('');
      }
    }
  };

  const onInputBlur = () => {
    if (triggerOnBlur) {
      onInputValueTriggered(valueInput);
      setValueInput('');
    }
  };

  const onCardsInputChange: OnInputChange = (e) => {
    setValueInput(e.target.value);
  };

  const getInputDisabledState = () => {
    return inputDisabled || (cardsCountLimit !== undefined && cards && cardsCountLimit <= cards.length);
  };

  useEffect(() => {
    if (valueInput) {
      setHidePlaceholder(false);
    } else {
      setHidePlaceholder(true);
    }
  }, [valueInput]);

  return (
    <Flex.Layout
      data-testid="cards-input"
      style={style}
      className={classnames('cards-input', className)}
      flex={1}
      flexDirection="column"
    >
      {/* Input title */}
      {cardsTitle && (
        <Text
          className={classnames('cards-input__label-title', {
            'cards-input__label-title--hide-placeholder': hidePlaceholder && !cards.length,
          })}
        >
          {cardsTitle}
        </Text>
      )}

      {/* Cards */}
      <Flex.Layout className="cards-input__cards" flexWrap="wrap">
        {cards.map((cardItem, index) => {
          const { title, avatarImage, avatarTitle } = getCardContent(cardItem);

          return (
            <CardsInputChip
              key={index}
              avatarTitle={avatarTitle}
              avatarImage={avatarImage}
              onRemoveClick={() => {
                if (onRemoveCardClick) {
                  onRemoveCardClick(cardItem, index);

                  if (inputRef) {
                    setTimeout(() => {
                      inputRef.current.focus();
                    });
                  }
                }
              }}
              tooltip={cardItem.tooltip}
              type={cardItem.type}
            >
              {title}
            </CardsInputChip>
          );
        })}
      </Flex.Layout>

      {/* Input */}
      <FormInput
        data-testid="cards-input-form-input"
        autoComplete={false}
        disabled={getInputDisabledState()}
        hideTitle
        message={inputValidationMessage}
        name="invite-email"
        onChange={onCardsInputChange}
        onKeyPress={onInputKeyPress}
        onBlur={onInputBlur}
        onKeyDown={onInputKeyDown}
        placeholder={cards.length ? '' : inputPlaceholder}
        value={valueInput}
        ref={inputRef}
      />
    </Flex.Layout>
  );
};
