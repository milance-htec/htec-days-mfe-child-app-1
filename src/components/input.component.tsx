import React, { FunctionComponent, ReactElement } from 'react';

export interface InputProps {
  value?: string;
  onChange: InputOnChange;
}

export type InputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => void;

export const Input: FunctionComponent<InputProps> = ({ onChange, value }) => {
  return <input type="text" onChange={onChange} value={value} />;
};

export default Input;
