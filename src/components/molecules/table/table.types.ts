import { ReactNode } from 'react';
import { BaseComponentProps } from 'common/types';
import { JustifyContentProperty } from 'csstype';

export interface TableProps extends BaseComponentProps {
  columns: TableColumn[] | undefined;
  rows: any[] | undefined;
  collapsibleRendered?: TableColumnRenderElement;
  noHeader?: boolean;
}

export interface TableRowProps extends BaseComponentProps {
  columnRenderers: TableColumnRenderElement[];
  collapsibleRendered?: TableColumnRenderElement;
  isExpanded: boolean;
  expandedHandler: (index: number) => void;
  rowData: any;
  rowIndex: number;
  columnOptions: ColumnOptions[];
  columnClassName: (string | undefined)[];
}

export interface CollapsibleRowProps extends BaseComponentProps {
  data: any;
  isExpanded: boolean;
  index: number;
  collapsibleRendered: TableColumnRenderElement;
}

export interface CollapsibleRowIconProps extends BaseComponentProps {
  expandedHandler: (index: number) => void;
  isExpanded: boolean;
  index: number;
}

export interface TableColumn {
  className?: string;
  columnAlignContent?: JustifyContentProperty;
  columnSpan?: number;
  renderElement: TableColumnRenderElement;
  sortable?: boolean;
  sortColumn?: (sortDirection: boolean) => void;
  title: string;
  titleTextAlign?: 'left' | 'center' | 'right';
}

export type TableColumnRenderElement<D = any> = (props: { data: D; index: number }) => ReactNode;

interface ColumnOptions {
  justifyContent: JustifyContentProperty;
}
