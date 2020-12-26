import { BaseComponentProps } from 'common/types';

export interface AvatarGroupTypes extends BaseComponentProps {
  avatarsInfo: AvatarInfo[];
}

export type AvatarInfo = {
  name: string;
  firstName?: string;
  lastName?: string;
};
