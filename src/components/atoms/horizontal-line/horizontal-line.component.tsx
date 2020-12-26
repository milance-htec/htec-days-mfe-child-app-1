import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Types */
import { HorizontalLineProps } from './horizontal-line.type';

/* Styles */
import './horizontal-line.scss';

export const HorizontalLine: FunctionComponent<HorizontalLineProps> = ({ className, style }) => {
  return <div data-testid="horizontal-line" className={classnames('horizontal-line', className)} style={style} />;
};
