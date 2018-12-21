import React, { PropTypes } from 'react';
import Sticky from 'react-sticky-el';

import MainNavbar from 'shared/main-navbar';
import TopNavbar from 'shared/top-navbar';

function Header({ children, location, organizations, selectOrganization, selectedOrganization }) {
  const { pathname } = location;
  const activeLink = pathname === '/' ? 'home' : pathname.replace('/', '');
  return (
    <div className="app-Header">
      <TopNavbar
        organizations={organizations}
        selectedOrganization={selectedOrganization}
        selectOrganization={selectOrganization}
      />
      <Sticky>
        <MainNavbar activeLink={activeLink} />
      </Sticky>
      {children}
    </div>
  );
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired,
  organizations: PropTypes.object,
  selectOrganization: PropTypes.func,
  selectedOrganization: PropTypes.object,
};

export default Header;
