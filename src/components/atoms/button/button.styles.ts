import { makeStyles, fade, Theme } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

import { ButtonTypes, ButtonVerticalSpacing } from './button.types';
import { BUTTON_TYPES } from './button.constants';

const { PRIMARY, SECONDARY, GHOST, TEXT, LINK } = BUTTON_TYPES;

const TRANSPARENT_COLOR = 'transparent';

const DEFAULT_STYLES: Record<string, CSSProperties> = {
  root: {
    padding: '6px 16px',
    borderRadius: '4px',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
};

export const useStylesButton = makeStyles<
  Theme,
  { variant: ButtonTypes; bottomSpacing?: ButtonVerticalSpacing; topSpacing?: ButtonVerticalSpacing }
>(
  ({
    palette: {
      common: { white },
      secondary: { main: secondaryMain, light: secondaryLight },
      dark: { main: darkMain },
      crayola: { main: crayolaMain, light: crayolaLight },
      unitedNations: { main: unitedNationsMain },
    },
  }) => ({
    root: ({ variant, bottomSpacing, topSpacing }) => {
      return {
        /* Default styles */
        ...DEFAULT_STYLES.root,
        /* Spacing-based styles */
        marginTop: (() => {
          switch (topSpacing) {
            case '1':
            case true:
              return '1.5rem';

            case '2':
              return '2rem';

            default:
              return;
          }
        })(),
        marginBottom: (() => {
          switch (bottomSpacing) {
            case '1':
            case true:
              return '1.5rem';

            case '2':
              return '2rem';

            default:
              return;
          }
        })(),
        /* Variant-based styles */
        ...(() => {
          switch (variant) {
            // Secondary
            case SECONDARY:
              return {
                backgroundColor: white,
                color: darkMain,
                borderColor: crayolaMain,
                '&:hover': {
                  backgroundColor: fade(crayolaMain, 0.25),
                },
                '&:focus': {
                  backgroundColor: fade(crayolaMain, 0.5),
                },
              };

            // Ghost
            case GHOST:
              return {
                backgroundColor: white,
                color: secondaryMain,
                borderColor: secondaryMain,
                '&:hover': {
                  backgroundColor: secondaryLight,
                },
                '&:focus': {
                  backgroundColor: secondaryLight,
                },
              };

            // Text
            case TEXT:
              return {
                backgroundColor: TRANSPARENT_COLOR,
                borderColor: TRANSPARENT_COLOR,
                color: secondaryMain,
                '&:hover': {
                  backgroundColor: secondaryLight,
                },
                '&:focus': {
                  backgroundColor: secondaryLight,
                },
              };

            // Link
            case LINK:
              return {
                backgroundColor: TRANSPARENT_COLOR,
                borderColor: TRANSPARENT_COLOR,
                color: unitedNationsMain,
                lineHeight: '1.3rem',
                padding: 0,
                textTransform: 'none' as any,
                '&:hover': {
                  backgroundColor: TRANSPARENT_COLOR,
                  borderBottom: `1px solid ${unitedNationsMain}`,
                },
              };

            // Primary
            case PRIMARY:
            default:
              return {
                backgroundColor: secondaryMain,
                color: white,
                '&:hover': {
                  backgroundColor: fade(secondaryMain, 0.75),
                },
                '&:focus': {
                  backgroundColor: fade(secondaryMain, 0.9),
                },
              };
          }
        })(),
      };
    },
    disabled: ({ variant }) => {
      switch (variant) {
        // Secondary and Ghost
        case SECONDARY:
        case GHOST:
          return {
            backgroundColor: white,
            borderColor: crayolaLight,
            color: crayolaMain,
          };

        // Text
        case TEXT:
          return {
            backgroundColor: TRANSPARENT_COLOR,
            borderColor: TRANSPARENT_COLOR,
            color: crayolaMain,
          };

        // Text
        case LINK:
          return {
            backgroundColor: TRANSPARENT_COLOR,
            borderColor: TRANSPARENT_COLOR,
            color: crayolaMain,
          };

        // Primary
        case PRIMARY:
        default:
          return {
            backgroundColor: crayolaLight,
            borderColor: TRANSPARENT_COLOR,
            color: crayolaMain,
          };
      }
    },
  }),
);
