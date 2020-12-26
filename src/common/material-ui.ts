import { createMuiTheme, withStyles } from '@material-ui/core';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';

const MuiColorPrimary = '#001E61';
const MuiColorSecondary = '#E81F76';
const MuiColorSecondaryLight = '#F7E9EF';
const MuiColorInfo = '#219EEA';
const MuiColorSuccess = '#3AD29F';
const MuiColorWarning = '#FFC602';
const MuiColorError = '#FF1D44';

const MuiCustomColorDark = '#5A606C';
const MuiCustomColorCrayola = '#B0B9C8';
const MauiCustomColorCrayolaLight = '#E0E4EC';
const MuiCustomColorPlatinum = '#F1F2F2';
const MuiCustomColorUnitedNations = '#5887DA';

const MuiColorWhite = '#FFFFFF';
const MuiColorBlack = '#000000';

const breakpoints = createBreakpoints({
  values: {
    xs: 426,
    sm: 601,
    md: 961,
    lg: 1281,
    xl: 1921,
    xxl: 5000,
  },
});

export const ReefCloudTheme = createMuiTheme({
  breakpoints,
  palette: {
    primary: {
      main: MuiColorPrimary,
    },
    secondary: {
      main: MuiColorSecondary,
      light: MuiColorSecondaryLight,
    },
    common: {
      white: MuiColorWhite,
      black: MuiColorBlack,
    },
    info: {
      main: MuiColorInfo,
    },
    success: {
      main: MuiColorSuccess,
    },
    warning: {
      main: MuiColorWarning,
    },
    error: {
      main: MuiColorError,
    },
    dark: {
      main: MuiCustomColorDark,
    },
    crayola: {
      light: MauiCustomColorCrayolaLight,
      main: MuiCustomColorCrayola,
    },
    platinum: {
      main: MuiCustomColorPlatinum,
    },
    unitedNations: {
      main: MuiCustomColorUnitedNations,
    },
  },
});

export const withCustomHtmlFontSizeBreakpoints = withStyles(() => {
  return {
    '@global': {
      html: {
        [breakpoints.up('xs')]: {
          fontSize: '10px',
        },
        [breakpoints.up('sm')]: {
          fontSize: '12px',
        },
        [breakpoints.up('md')]: {
          fontSize: '14px',
        },
        [breakpoints.up('lg')]: {
          fontSize: '16px',
        },
        [breakpoints.up('xl')]: {
          fontSize: '20px',
        },
        [breakpoints.up('xxl')]: {
          fontSize: '32px',
        },
      },
    },
  };
});
