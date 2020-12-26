import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import classnames from 'classnames';

/* Components */
import { Heading, Image, Button } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { HomeModuleTileProps } from './home-module-tile.types';

/* Styles */
import './home-module-tile.scss';

export const HomeModuleTile: FunctionComponent<HomeModuleTileProps> = ({
  children,
  className,
  image,
  qaName,
  route,
  style,
  buttonId,
}) => {
  const history = useHistory();

  const onModuleClick = () => {
    history.push(route);
  };

  return (
    <div data-testid="home-module-tile" className={classnames('home-module-tile', className)} style={style}>
      <Flex.Layout justifyContent="center" className="home-module-tile__image">
        <Image src={image} />
      </Flex.Layout>

      <Flex.Layout justifyContent="center" className="home-module-tile__heading">
        <Heading type={2}>{children}</Heading>
      </Flex.Layout>

      <Flex.Layout justifyContent="center">
        <Button
          id={buttonId}
          data-testid="home-module-tile-button"
          qaName={qaName}
          onClick={onModuleClick}
          variant="ghost"
        >
          VIEW
        </Button>
      </Flex.Layout>
    </div>
  );
};
