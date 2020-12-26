import { OnInputKeyboardEvent } from 'common/types';

export function isCapslock(e: OnInputKeyboardEvent) {
  return e.getModifierState('CapsLock');
}
