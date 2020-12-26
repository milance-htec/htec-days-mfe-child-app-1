import React, { FunctionComponent } from 'react';

/* Components */
import { Flex } from 'components/molecules';

/* Types */
import { PageFiltersProps } from './page-filters.types';

/* Styles */
import './page-filters.scss';

export const PageFilters: FunctionComponent<PageFiltersProps> = ({ children, alignItems = 'flex-end' }) => {
  return (
    <Flex.Layout className="page-filters" justifyContent="space-between" alignItems={alignItems}>
      {children}
    </Flex.Layout>
  );
};
