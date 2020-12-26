import { getAvatarLetters } from './../user-avatar.uitlity';

it('Should return first letter of provided email', () => {
  expect(
    getAvatarLetters({
      email: 'test@test.com',
    }),
  ).toBe('t');
});

it('Should return first letters from firstName and lastName provided', () => {
  expect(
    getAvatarLetters({
      firstName: 'Test',
      lastName: 'Example',
    }),
  ).toBe('TE');
});

it('Should return first letter from firstName provided', () => {
  expect(
    getAvatarLetters({
      firstName: 'Test',
    }),
  ).toBe('T');
});

it('Should return first letter from lastName provided', () => {
  expect(
    getAvatarLetters({
      lastName: 'Example',
    }),
  ).toBe('E');
});

it('Should return empty string if non of the values are sent', () => {
  expect(getAvatarLetters({})).toBe('');
});

it('Should return empty string if non of the values are sent', () => {
  expect(getAvatarLetters()).toBe('');
});
