/* Constnats */
import { MONTHS } from './constants';
import { FORM_INPUT_MESSAGE_TYPES } from 'components/molecules/form-input/form-input.constants';

/* Types */
import { FormInputMessage } from 'components/molecules/form-input/form-input.types';
import { GetInputErrorMessageProps } from './types';

// deep copy array or object
export const deepCopy = (inObject: any) => {
  let outObject: any;

  outObject = JSON.parse(JSON.stringify(inObject));
  return outObject;
};

// deep compare objects
export const deepEqual = (a: any, b: any) => {
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (var key in a) if (!deepEqual(a[key], b[key])) return false;
    return true;
  } else return a === b;
};

// date helper
export const getHumanReadableDate = (time: string): string => {
  const date = new Date(time);

  const year = date.getFullYear();
  const currentMonth = date.getMonth();
  const day = date.getDate();

  const timeString = `${day} ${MONTHS[currentMonth].slice(0, 3)} ${year}`;
  return timeString;
};

// Date validator
export function validateDate(date: string): boolean {
  const re = /^\d{4}[-](0?[1-9]|1[012])[-](0?[1-9]|[12][0-9]|3[01])$/;
  return re.test(date);
}

// Email vlaidator
export function validateEmail(email: string): boolean {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Phone number vlaidator
export function validatePhoneNumber(phoneNumber: string): boolean {
  const re = /^[+][-\s./0-9]{7,50}$/g;
  return re.test(phoneNumber.replace(/ /g, ''));
}

// Word plural converter
export function pluralStringHandler(value: number, singularString: string, pluralString: string) {
  return value !== 1 ? pluralString : singularString;
}

// Get error message for input field
export function getInputErrorMessage({ touched, message }: GetInputErrorMessageProps): FormInputMessage | undefined {
  return touched && message
    ? {
        message,
        type: FORM_INPUT_MESSAGE_TYPES.ERROR,
      }
    : undefined;
}

// Add 3 dots on text
export function add3Dots(text: string, limit: number) {
  const dots = '...';
  if (text.length > limit) {
    // you can also use substr instead of substring
    text = text.substring(0, limit) + dots;
  }
  return text;
}

//Make full name
export function makeFullName(firstName?: string, lastName?: string) {
  return `${firstName} ${lastName}`;
}
