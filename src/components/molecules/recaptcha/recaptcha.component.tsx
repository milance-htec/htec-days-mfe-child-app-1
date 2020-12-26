import React, { FunctionComponent } from 'react';
import ReactRecaptcha from 'react-google-recaptcha';

import { isDevEnv } from 'App';
import { RecaptchaProps } from './recaptcha.types';

export const Recaptcha: FunctionComponent<RecaptchaProps> = ({ onChange, siteKey }) => {
  return !isDevEnv ? <ReactRecaptcha data-testid="recaptcha" sitekey={siteKey} onChange={onChange} /> : null;
};
