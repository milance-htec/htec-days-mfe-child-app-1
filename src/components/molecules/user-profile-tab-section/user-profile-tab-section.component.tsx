import React, { FunctionComponent } from 'react';

/* Types */
import { UserProfileTabSectionProps } from './user-profile-tab-section.types';

/* Styles */
import './user-profile-tab-section.scss';

export const UserProfileTabSection: FunctionComponent<UserProfileTabSectionProps> = ({ children, title }) => {
  return (
    <div className="user-profile-tab-section">
      {title ? <div className="user-profile-tab-section__heading">{title}</div> : null}
      {children}
    </div>
  );
};
