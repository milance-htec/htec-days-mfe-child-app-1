import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Types */
import { HeadingProps } from './heading.types';

/* Styles */
import './heading.component.scss';

export const Heading: FunctionComponent<HeadingProps> = ({
  bottomSpacing = false,
  children,
  className,
  onClick,
  style,
  textColor = 'blue',
  textAlign = 'left',
  type = 1,
}) => (
  <>
    {(() => {
      switch (type) {
        case 2:
          return (
            <h2
              className={classnames('heading', className, `heading--${textColor}`, `heading--${type}`, {
                'heading--bottom-spacing': bottomSpacing,
              })}
              onClick={onClick}
              style={{ textAlign, ...style }}
              data-testid="heading-2"
            >
              {children}
            </h2>
          );

        case 3:
          return (
            <h3
              className={classnames('heading', className, `heading--${textColor}`, `heading--${type}`, {
                'heading--bottom-spacing': bottomSpacing,
              })}
              onClick={onClick}
              style={{ textAlign, ...style }}
              data-testid="heading-3"
            >
              {children}
            </h3>
          );

        case 4:
          return (
            <h4
              className={classnames('heading', className, `heading--${textColor}`, `heading--${type}`, {
                'heading--bottom-spacing': bottomSpacing,
              })}
              onClick={onClick}
              style={{ textAlign, ...style }}
              data-testid="heading-4"
            >
              {children}
            </h4>
          );

        case 5:
          return (
            <h5
              className={classnames('heading', className, `heading--${textColor}`, `heading--${type}`, {
                'heading--bottom-spacing': bottomSpacing,
              })}
              onClick={onClick}
              style={{ textAlign, ...style }}
              data-testid="heading-5"
            >
              {children}
            </h5>
          );

        case 6:
          return (
            <h6
              className={classnames('heading', className, `heading--${textColor}`, `heading--${type}`, {
                'heading--bottom-spacing': bottomSpacing,
              })}
              onClick={onClick}
              style={{ textAlign, ...style }}
              data-testid="heading-6"
            >
              {children}
            </h6>
          );

        default:
          return (
            <h1
              className={classnames('heading', className, `heading--${textColor}`, `heading--${type}`, {
                'heading--bottom-spacing': bottomSpacing,
              })}
              onClick={onClick}
              style={{ textAlign, ...style }}
              data-testid="heading-1"
            >
              {children}
            </h1>
          );
      }
    })()}
  </>
);
