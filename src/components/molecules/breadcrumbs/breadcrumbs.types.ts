import { BaseComponentProps } from 'common/types';

export interface BreadcrumbsProps extends BaseComponentProps {
  crumbs: (string | BreadcrumbRowItem)[];
}

export type BreadcrumbRowItem = {
  title: string;
  onClick: () => void;
};
