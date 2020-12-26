import React from 'react';
import classnames from 'classnames';

import { ParagraphProps } from './paragraph.types';

import './paragraph.component.scss';

export const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ children, className, textAlign = 'left', color = '', onClick, size = 2, style, bottomSpacing = false }, ref) => (
    <p
      data-testid="paragraph"
      className={classnames(
        'paragraph',
        className,
        [`paragraph--${size}`, `paragraph--${color}`, `paragraph--${textAlign}`],
        {
          'paragraph--bottom-spacing': bottomSpacing,
        },
      )}
      style={style}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </p>
  ),
);
