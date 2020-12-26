import React, { useRef, FunctionComponent } from 'react';
import { Clear } from '@material-ui/icons';
import classnames from 'classnames';

/* Components */
import { Heading, Icon } from 'components/atoms';
import { Flex } from 'components/molecules';

/* Types */
import { ModalProps } from './modal.types';
import { OnDivElementClick } from 'common/types';

/* Styles */
import './modal.component.scss';

export const Modal: FunctionComponent<ModalProps> = ({
  children,
  className,
  closeButtonIcon = true,
  closeButtonIconDisabled = false,
  contentClassName,
  fixedHeight = false,
  footer,
  headerCustomContent,
  heading,
  nonTransparentBackground = false,
  onModalBlur,
  showModal,
  style,
}) => {
  const parentRef = useRef<any>();

  const onModalClick: OnDivElementClick = (e) => {
    if (e.target === parentRef.current) {
      if (onModalBlur) {
        onModalBlur();
      }
    }
  };

  return showModal ? (
    <div
      style={style}
      ref={parentRef}
      className={classnames('modal', className, {
        'modal--non-transparent-bg': nonTransparentBackground,
      })}
      data-testid="modal"
      onMouseDown={onModalClick}
    >
      <div
        className={classnames('modal__content', contentClassName, {
          'modal__content--fixed-height': fixedHeight,
        })}
      >
        {/* Header */}
        {heading !== undefined || headerCustomContent !== undefined || closeButtonIcon ? (
          <header className="modal__header">
            <Flex.Layout justifyContent="space-between" alignItems="center" className="modal__header-buttons">
              <Flex.Item flexGrow={1}>
                <Heading type={2} className="modal__header-title">
                  {heading}
                </Heading>
              </Flex.Item>

              {/* Heading custom content */}
              {headerCustomContent !== undefined ? <Flex.Layout flex={1}>{headerCustomContent}</Flex.Layout> : null}

              {/* Exit button */}
              {closeButtonIcon ? (
                <Icon
                  className={classnames('modal__close-button-icon', {
                    'modal__close-button-icon--disabled': closeButtonIconDisabled,
                  })}
                  onClick={closeButtonIconDisabled ? undefined : onModalBlur}
                >
                  <Clear />
                </Icon>
              ) : null}
            </Flex.Layout>
          </header>
        ) : null}

        {/* Content */}
        <div
          className={classnames('modal__inner', {
            'modal__inner--fixed-height': fixedHeight,
          })}
        >
          {children}
        </div>

        {/* Footer */}
        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </div>
  ) : null;
};
