import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Components */
import { Image } from 'components/atoms';

/* Types and constants */
import { LoaderProps } from './loader.types';

import ReefLogoImage from 'assets/images/loader_normal.svg';

import './loader.component.scss';

export const Loader: FunctionComponent<LoaderProps> = ({
  onClick,
  className,
  style,
  loaderFlag,
  noBackground,
  backgroundOpacityPointVariant = 5,
}) => {
  return loaderFlag ? (
    <div
      data-testid="loader"
      style={style}
      className={classnames('loader', className, {
        'loader--no-background': noBackground,
        [`loader--background${backgroundOpacityPointVariant}`]: !noBackground,
      })}
      onClick={onClick}
    >
      <Image src={ReefLogoImage} alt="Loading" />
    </div>
  ) : null;
};
