import { BaseComponentProps } from 'common/types';

export interface UserProfileModalContentProps extends BaseComponentProps {
  title: string;
  description: string;
  descriptionBottomGap?: 'normal' | 'small';
}
