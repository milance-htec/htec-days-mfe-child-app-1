import React, { FunctionComponent, ReactElement } from 'react';

export interface ButtonProps {
  onClick?: () => void;
  type?: 'submit' | 'reset' | 'button';
}

export const Button: FunctionComponent<ButtonProps> = ({ onClick, children, type = 'button' }) => {
  return (
    <button type={type} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
