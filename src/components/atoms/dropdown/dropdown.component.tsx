import React, { FunctionComponent } from 'react';
import classnames from 'classnames';

/* Types and constatns */
import { DropdownProps } from './dropdown.types';

/* Services and utils */
import useOuterClick from 'common/useOuterClick.hook';

/* Styles */
import './dropdown.scss';

export const Dropdown: FunctionComponent<DropdownProps> = (props) => {
  return props.showDropdown ? <DropdownComponentBody {...props} /> : null;
};

const DropdownComponentBody: FunctionComponent<DropdownProps> = ({
  children,
  className,
  direction = 'down',
  footerOptions,
  onDropdownHide,
  options,
  showDropdown,
  style,
  title,
}) => {
  const innerRef = useOuterClick((e) => {
    if (showDropdown) {
      onDropdownHide && onDropdownHide();
    }
  }, title);

  return showDropdown ? (
    <div className="dropdown-body">
      <div
        data-testid="dropdown"
        style={style}
        className={classnames('dropdown', className, { 'dropdown--up': direction === 'up' })}
        ref={innerRef}
      >
        {children ? (
          <div className="dropdown__children-dropdown">{children}</div>
        ) : (
          <ul>
            {title ? <li className="dropdown__title">{title}</li> : null}
            {options &&
              options.map((option, index) => (
                <li
                  data-testid={`dropdown-option-${index}`}
                  className="dropdown__item"
                  key={index}
                  onClick={() => {
                    option.action && option.action(option.value);
                    onDropdownHide && onDropdownHide();
                  }}
                >
                  {option.name}
                </li>
              ))}
          </ul>
        )}

        {/* Footer options */}
        {footerOptions && footerOptions.length ? (
          <div className="dropdown__footer">
            <ul>
              {footerOptions.map((footerOptionsItem, index) => (
                <li
                  data-testid={`dropdown-footer-option-${index}`}
                  className="dropdown__footer-item"
                  key={index}
                  onClick={() => {
                    footerOptionsItem.action && footerOptionsItem.action(footerOptionsItem.value);
                    onDropdownHide && onDropdownHide();
                  }}
                >
                  {footerOptionsItem.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};
