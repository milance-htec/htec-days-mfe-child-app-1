import { BaseComponentProps } from 'common/types';

export interface UserAvatarProps extends BaseComponentProps<HTMLElement> {
  email?: string;
  firstName?: string;
  isUserActive?: any;
  lastName?: string;
  fontSize?: 'default' | 'small' | 'larage';
  imageUrl?: string;
}
