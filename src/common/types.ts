import React, { CSSProperties } from 'react';

export type OnClickFunction<E = HTMLElement> = (event: React.MouseEvent<E, MouseEvent>) => void;

export interface BaseComponentProps<E = HTMLElement> {
  children?: React.ReactNode;
  className?: string;
  onClick?: OnClickFunction<E>;
  style?: CSSProperties;
  qaName?: string;
  id?: string;
  testId?: string;
}

/* Pagination */
export interface PaginationResponse<D> {
  content: D[];
  totalItems: number;
  totalPages: number;
}

export interface PaginationTokenResponse<D> {
  content: D[];
  paginationToken: string;
}

export interface PaginateOptions {
  page: number;
  perPage: number;
}

/* Input messages */
export type GetInputErrorMessageProps = {
  touched?: boolean;
  message?: string;
};

/* Modals */
export interface ModalBaseProps<O = any> {
  modalState: boolean;
  setModalState: (state: boolean, modalOptions?: O) => () => void;
}

/* Components events types */
export type OnInputChangeEvent = React.ChangeEvent<HTMLInputElement>;
export type OnInputFocusEvent = React.FocusEvent<HTMLInputElement>;
export type DivElementMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
export type OnInputKeyboardEvent = React.KeyboardEvent<HTMLInputElement>;

export type OnInputChange = (e: OnInputChangeEvent) => void;
export type OnInputFocus = (e: OnInputFocusEvent) => void;
export type OnInputBlur = (e: OnInputFocusEvent) => void;
export type OnDivElementClick = (e: DivElementMouseEvent) => void;
export type OnInputKeyboard = (e: OnInputKeyboardEvent) => void;

/* Materila components types */
export type SelectOnChange = (
  event: React.ChangeEvent<{ name?: string; value: unknown }>,
  child: React.ReactNode,
) => void;

/* User statuses */
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INVITED';

/* Consumer statuses */
export type ConsumerStatus = 'ACTIVE' | 'PENDING_SIGN_UP' | 'SUSPENDED';

/* User order by */
export type UserOrderBy =
  | 'ROLES_ASC'
  | 'ROLES_DESC'
  | 'STATUS_ASC'
  | 'STATUS_DESC'
  | 'DATE_MODIFIED_ASC'
  | 'DATE_MODIFIED_DESC';

/* User modules */
export type UserModulePermission = 'OWNER' | 'VIEWER';

export type FormikSetFieldValue<Values> = (field: keyof Values, value: any, shouldValidate?: boolean) => void;

/* Material overrides */
declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    dark: Palette['primary'];
    crayola: Palette['primary'];
    platinum: Palette['primary'];
    unitedNations: Palette['primary'];
  }
  interface PaletteOptions {
    dark: PaletteOptions['primary'];
    crayola: PaletteOptions['primary'];
    platinum: PaletteOptions['primary'];
    unitedNations: PaletteOptions['primary'];
  }
}

declare module '@material-ui/core/styles/createBreakpoints' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    xxl: true;
  }
}
