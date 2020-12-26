import { ModalBaseProps } from 'common/types';
import { Consumer } from 'components/pages/consumers/consumers.types';

export interface ConsumerProfileModalProps extends ModalBaseProps {
  consumerId: string | null;
  onConsumerUpdate: () => void;
}

/* App logic */

export type ConsumerProfileModalTabListItem = {
  title: string;
  key: 'profile';
};

export type ConsumerProfileModalTabsListKeys = 'profile';

/* GraphQL */
export type GQLGetConsumerDataByIdResult = {
  consumerUserDataById: Consumer | null;
};

export type GQLGetConsumerDataByIdVariables = {
  consumerId: number;
};
