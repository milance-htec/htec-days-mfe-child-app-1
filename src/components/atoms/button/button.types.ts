import { BaseComponentProps } from 'common/types';

import { SvgIconComponent } from '@material-ui/icons';

export type ButtonTypes = 'primary' | 'secondary' | 'ghost' | 'text' | 'link';

export type ButtonVerticalSpacing = '1' | '2' | boolean;

export interface ButtonProps extends BaseComponentProps {
  bottomSpacing?: ButtonVerticalSpacing;
  disabled?: boolean;
  endIcon?: SvgIconComponent;
  href?: string;
  linkActionType?: 'push' | 'replace';
  startIcon?: SvgIconComponent;
  topSpacing?: ButtonVerticalSpacing;
  type?: 'button' | 'reset' | 'submit';
  variant?: ButtonTypes;
}
