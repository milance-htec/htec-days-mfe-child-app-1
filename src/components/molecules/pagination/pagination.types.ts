import { BaseComponentProps } from 'common/types';
import { DropdownOption } from 'components/atoms/dropdown/dropdown.types';

export interface PaginationProps extends BaseComponentProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageLimit: number;
  pageLimitOptions: DropdownOption[];
  onPageLimitChange?: (pageLimit: number) => void;
  nextPage?: () => void;
  previousPage?: () => void;
}
