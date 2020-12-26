import { makeStyles } from '@material-ui/core';

export const useStylesCheckbox = makeStyles(({ palette: { dark, unitedNations } }) => ({
  root: {
    color: dark.main,
    '&$checked': {
      color: unitedNations.main,
    },
    '&$disabled': {
      color: '#E0E4EC',
    },
  },
  checked: {},
  disabled: {},
}));
