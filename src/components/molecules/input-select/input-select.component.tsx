import React, { useState, useEffect, FunctionComponent } from 'react';
import classnames from 'classnames';
import { KeyboardArrowDown, KeyboardArrowUp, Clear } from '@material-ui/icons';

/* Components */
import { Icon, Text, Input, Paragraph } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types and constants */
import { InputSelectProps, InputSelectOption, OptionListProps } from './input-select.types';
import { OnInputChangeEvent } from 'common/types';

/* Services and utilities */
import useOuterClick from 'common/useOuterClick.hook';
import { useIntersectionObserver } from 'common/intersection.hook';

/* Styles */
import './input-select.scss';

export const InputSelect: FunctionComponent<InputSelectProps> = ({
  clearValueIcon = false,
  className,
  currentPage = 0,
  onInputChange = undefined,
  onListEnd = () => {},
  onOptionSelect,
  options,
  optionsLoading = false,
  placeholder,
  style,
  title,
  totalPages = 0,
  type = 'select',
  unselectElement = false,
  unselectElementTitle = '',
  value = '',
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [inputValue, setInputValue] = useState<InputSelectOption | null>(null);
  const [setRef, visible] = useIntersectionObserver({});
  const [optionsForList, setOptionsForList] = useState<InputSelectOption[]>([]);

  const onDropdownClick = (shouldShowOptions: boolean) => () => {
    if (optionsForList.length) {
      setShowOptions(!shouldShowOptions);
    } else if (!optionsForList.length) {
      setShowOptions(false);
    }
  };

  const onInputOptionClick = (selectedOption: InputSelectOption, index: number) => () => {
    if (unselectElement && index === 0) {
      onOptionSelect(null);
      setInputValue(null);
    } else {
      onOptionSelect(selectedOption);
      setInputValue(selectedOption);
    }

    setShowOptions(false);
  };

  const inputHasChanged = (e: OnInputChangeEvent) => {
    if (onInputChange) {
      setInputValue(null);

      onInputChange(e.target.value);
      setShowOptions(true);
    }
  };

  const clearInputValue = () => {
    if (onInputChange) {
      onInputChange('');
    }

    setTimeout(() => {
      onOptionSelect(null);
      setShowOptions(false);
    });
  };

  useEffect(() => {
    if (options && options.length) {
      if (unselectElement) {
        setOptionsForList([{ title: unselectElementTitle, value: null }, ...options]);
      } else {
        setOptionsForList([...options]);
      }
    } else {
      setOptionsForList([]);
    }
  }, [options, unselectElementTitle, unselectElement]);

  useEffect(() => {
    if (!optionsLoading && visible && totalPages > 0 && totalPages > currentPage + 1) {
      onListEnd();
    }
    // eslint-disable-next-line
  }, [visible]);

  return (
    <div data-testid="input-select" className={classnames('input-select', className)} style={style}>
      <div className="input__label-title">
        <Text color="link">{inputValue && value ? title : ''}</Text>
      </div>
      <Flex.Layout data-testid="input-select-dropdown" className="input-field" onClick={onDropdownClick(showOptions)}>
        {type === 'select' ? (
          <Flex.Layout
            className={classnames('input-field__fillin-input-placeholder', {
              'input-field__fillin-input-placeholder--with-value':
                inputValue && inputValue.title ? inputValue.title : '',
            })}
            alignItems="center"
            flex={1}
          >
            {inputValue && inputValue.title ? inputValue.title : placeholder}
          </Flex.Layout>
        ) : (
          <>
            <Input onChange={inputHasChanged} name="user-role" value={value} placeholder={placeholder} />
            {clearValueIcon ? (
              <Icon
                data-testid="input-select-input-clear-icon"
                onClick={clearInputValue}
                className="dropdown-clear-value-icon"
              >
                <Clear />
              </Icon>
            ) : null}
          </>
        )}
        <Icon
          onClick={type === 'input' ? onDropdownClick(showOptions) : undefined}
          className={classnames('dropdown-icon', { 'dropdown-icon--has-value': value })}
        >
          {showOptions ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </Icon>
      </Flex.Layout>
      {showOptions ? (
        <OptionsList
          options={optionsForList}
          onInputOptionClick={onInputOptionClick}
          onListBlur={onDropdownClick(showOptions)}
          listOptionsRef={setRef}
          currentPage={currentPage}
          totalPages={totalPages}
          optionsLoading={optionsLoading}
        />
      ) : null}
    </div>
  );
};

const OptionsList: FunctionComponent<OptionListProps> = ({
  options,
  onInputOptionClick,
  onListBlur,
  listOptionsRef,
  currentPage = 0,
  totalPages = 0,
  optionsLoading = false,
}) => {
  const listReft = useOuterClick(() => {
    onListBlur();
  });

  return (
    <div data-testid="input-select-option-list" className="select-options" ref={listReft}>
      {options.map((option, index) => {
        return (
          <div
            data-testid="input-select-option-list-option"
            className="option"
            key={index}
            onClick={onInputOptionClick(option, index)}
          >
            {option.title}
          </div>
        );
      })}
      <Flex.Layout justifyContent="center">
        {currentPage + 1 < totalPages ? (
          <Paragraph
            ref={listOptionsRef}
            className={classnames({
              'paragraph--hidden': (totalPages < 2 && !optionsLoading) || (!options.length && !optionsLoading),
            })}
          >
            Loading...
          </Paragraph>
        ) : null}
      </Flex.Layout>
    </div>
  );
};
