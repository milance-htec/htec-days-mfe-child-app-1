import { FORM_INPUT_MESSAGE_TYPES } from 'components/molecules/form-input/form-input.constants';
import { pluralStringHandler, getHumanReadableDate, validateEmail, getInputErrorMessage } from '../utility';

/* timeToHumanReadable */
describe('getHumanReadableDate', () => {
  it('Should show <Month Day Year> format from provided data', () => {
    expect(getHumanReadableDate('2020-10-06T10:43:30.619544')).toBe('6 Oct 2020');
  });
});

/* validateEmail */
describe('validateEmail', () => {
  it('Should return true if email is valid format', () => {
    expect(validateEmail('test@test.com')).toBe(true);
  });

  it('Should return false if email is not valid format', () => {
    expect(validateEmail('test@test,com')).toBe(false);
  });
});

/* pluralStringHandler */
describe('pluralStringHandler', () => {
  it('Should return singular provided string if value is 1', () => {
    expect(pluralStringHandler(1, 'example', 'examples')).toBe('example');
  });

  it('Should return plural provided string if value is not 1', () => {
    expect(pluralStringHandler(10, 'example', 'examples')).toBe('examples');
  });
});

/* getInputErrorMessage */
describe('getInputErrorMessage', () => {
  const errorMessage = 'Some error message';

  it('Should return error message with provided message if touched', () => {
    expect(
      getInputErrorMessage({
        touched: true,
        message: errorMessage,
      }),
    ).toMatchObject({
      message: errorMessage,
      type: FORM_INPUT_MESSAGE_TYPES.ERROR,
    });
  });

  it('Should return undefined if touched is false', () => {
    expect(
      getInputErrorMessage({
        touched: false,
        message: errorMessage,
      }),
    ).toEqual(undefined);
  });

  it('Should return undefined if message is empty', () => {
    expect(
      getInputErrorMessage({
        touched: true,
        message: '',
      }),
    ).toEqual(undefined);
  });
});
