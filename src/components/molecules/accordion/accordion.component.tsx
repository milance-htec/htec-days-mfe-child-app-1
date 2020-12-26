import React, { FunctionComponent, useState } from 'react';
import classnames from 'classnames';
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';

/* Types */
import { AccordionProps } from './accordion.types';

/* Components */
import { Flex } from 'components/molecules';

/* Styles */
import './accordion.scss';
import { Icon } from 'components/atoms';

export const Accordion: FunctionComponent<AccordionProps> = ({
  content,
  expandible,
  onExpandChange,
  value,
  expandiblePadding = 0,
  className,
  style,
}) => {
  const [expanded, setExpanded] = useState(false);

  const expandedHandler = () => {
    if (onExpandChange) {
      onExpandChange(expanded, value);
    }
    setExpanded(!expanded);
  };

  return (
    <Flex.Layout
      data-testid="accordion"
      className={classnames('accordion', className)}
      style={style}
      flexDirection="column"
    >
      <Flex.Layout className="accordion__content">
        <Flex.Layout
          style={{ padding: `0 0 0 ${expandiblePadding}rem` }}
          alignItems="center"
          className="accordion__content--icon"
        >
          <Icon data-testid="accordion-icon" onClick={expandedHandler}>
            {expanded ? <ArrowDropUp /> : <ArrowDropDown />}
          </Icon>
        </Flex.Layout>
        <Flex.Item className="accordion__content--data">{content}</Flex.Item>
      </Flex.Layout>
      <Flex.Item className={classnames('accordion__expandible', { 'accordion__expandible--expanded': expanded })}>
        {expandible}
      </Flex.Item>
    </Flex.Layout>
  );
};
