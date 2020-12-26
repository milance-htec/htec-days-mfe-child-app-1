import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Components */
import { Radio } from 'components/atoms';
import { Flex } from 'components/molecules';

/* types */
import { LabeledRadioProps } from './labeled-radio.types';

/* Styles */
import './labeled-radio.component.scss';

export const LabeledRadio: FunctionComponent<LabeledRadioProps> = ({
  textOnLeftSide,
  text,
  style,
  className,
  value,
  isChecked = false,
  group,
  onRadioButtonClick,
}) => {
  const onRadioButtonChange = (radioValue: any) => {
    if (onRadioButtonClick) {
      onRadioButtonClick(radioValue);
    }
  };

  return (
    <Flex.Layout
      data-testid="labeled-radio"
      className={classnames('labeled-radio', className)}
      alignItems="center"
      style={style}
    >
      {textOnLeftSide ? text : ''}
      <Radio
        className={classnames({
          'labeled-radio--left-margin': textOnLeftSide,
          'labeled-radio--right-margin': !textOnLeftSide,
        })}
        group={group}
        value={value}
        checked={isChecked}
        onChange={onRadioButtonChange}
        disabled={false}
      ></Radio>
      {!textOnLeftSide ? text : ''}
    </Flex.Layout>
  );
};
