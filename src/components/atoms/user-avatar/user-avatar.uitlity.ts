import { IS_ONLY_ALPHANUMERIC_AND_SPACE_REG_EXP } from 'common/constants';

export function getAvatarLetters(props?: { email?: string; firstName?: string; lastName?: string }) {
  if (props) {
    const { email, firstName, lastName } = props;
    let firstLetters = '';

    if (firstName || lastName) {
      if (firstName && firstName[0].match(IS_ONLY_ALPHANUMERIC_AND_SPACE_REG_EXP)) {
        firstLetters += firstName[0];
      }

      if (lastName && lastName[0].match(IS_ONLY_ALPHANUMERIC_AND_SPACE_REG_EXP)) {
        firstLetters += lastName[0];
      }
    } else if (email) {
      firstLetters = email[0];
    }

    return firstLetters;
  }

  return '';
}
