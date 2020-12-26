import { BaseComponentProps } from 'common/types';

export interface HomeModuleTileProps extends BaseComponentProps {
  route: string;
  image: string;
  qaName?: string;
  buttonId?: string;
}
