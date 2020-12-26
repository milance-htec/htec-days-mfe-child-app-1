import React, { FunctionComponent } from 'react';

import { ImageProps } from './image.types';

import './image.component.scss';

export const Image: FunctionComponent<ImageProps> = ({ src, className, alt, onClick, style }) => (
  <img src={src} alt={alt} className={className} onClick={onClick} style={style} data-testid="image" />
);
