import React, { FunctionComponent, ReactElement } from 'react';

export interface ButtonProps {
  onClick?: () => void;
}

export const Button: FunctionComponent<ButtonProps> = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

export default Button;
