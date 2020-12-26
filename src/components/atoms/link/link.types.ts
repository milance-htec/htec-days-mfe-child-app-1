import { BaseComponentProps } from 'common/types';

export interface LinkProps extends BaseComponentProps<HTMLAnchorElement> {
  href?: string;
  bold?: boolean;
}
