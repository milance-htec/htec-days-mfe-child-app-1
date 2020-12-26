import { BaseComponentProps } from 'common/types';
import { FormInputMessage } from '../form-input/form-input.types';

export interface CardsInputProps extends BaseComponentProps {
  cards: CardLabelItem[];
  cardsCountLimit?: number;
  cardsTitle?: string;
  getCardContent: (item: any) => CardInputContent;
  inputDisabled?: boolean;
  inputPlaceholder?: string;
  inputValidationMessage?: FormInputMessage;
  onInputValueTriggered: (inputValue: string) => void;
  onRemoveCardClick?: (data: any, index: number) => void;
  triggerInputValueEmitKeys?: string[] | string;
  triggerOnBlur?: boolean;
}

export interface CardLabelItem<D = any> {
  type: 'error' | 'blue' | 'light-blue';
  tooltip?: string;
  data: D;
}

export type CardInputContent = { title: string; avatarImage?: string; avatarTitle?: string };
