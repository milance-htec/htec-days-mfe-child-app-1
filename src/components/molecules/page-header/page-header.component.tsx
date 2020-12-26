import React, { FunctionComponent } from 'react';
import classnames from 'classnames';
import { useHistory } from 'react-router-dom';

/* Components */
import { Heading } from 'components/atoms';
import { Flex, Breadcrumbs } from 'components/molecules';

/* Types */
import { PageHeaderProps } from './page-header.types';

/* Constants */
import { ROUTES } from 'common/constants';

/* Styles */
import './page-header.scss';

export const PageHeader: FunctionComponent<PageHeaderProps> = ({
  breadcrumbs = true,
  children,
  className,
  style,
  title = '',
}) => {
  const history = useHistory();

  return (
    <Flex.Layout
      data-testid="page-header"
      className={classnames('page-header', className)}
      flexDirection="column"
      style={style}
    >
      {/* Breadcrumbs */}
      {breadcrumbs ? (
        <Flex.Layout className="page-header__breadcrumbs-container" alignItems="center">
          <Breadcrumbs
            crumbs={[
              {
                title: 'Identity Access',
                onClick: () => history.push(ROUTES.HOME),
              },
              document.title,
            ]}
          />
        </Flex.Layout>
      ) : null}

      {/* Title */}
      <Flex.Layout alignItems="center" flexGrow={1}>
        <Heading>{title}</Heading>
        <Flex.Layout flexGrow={1} justifyContent="flex-end" alignItems="center">
          {children}
        </Flex.Layout>
      </Flex.Layout>
    </Flex.Layout>
  );
};
