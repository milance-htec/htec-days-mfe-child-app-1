import { FunctionComponent, useEffect } from 'react';
import { useFormikContext } from 'formik';

/* Types */
import { FormikContextProps } from './formik-context.types';

/* Styles */
import './formik-context.component.scss';

export const FormikContext: FunctionComponent<FormikContextProps> = ({ onValuesUpdate }) => {
  const { values } = useFormikContext();

  useEffect(() => {
    onValuesUpdate(values);
  }, [values, onValuesUpdate]);

  return null;
};
