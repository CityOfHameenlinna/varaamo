import MobileDetect from 'mobile-detect';
import React, { Component, PropTypes } from 'react';
import BodyClassName from 'react-body-classname';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';

import { fetchOrganizations } from 'actions/organizationActions';
import { fetchUser } from 'actions/userActions';
import { enableGeoposition, selectOrganization } from 'actions/uiActions';
import Favicon from 'shared/favicon';
import Footer from 'shared/footer';
import Header from 'shared/header';
import TestSiteMessage from 'shared/test-site-message';
import Notifications from 'shared/notifications';
import { getCustomizationClassName } from 'utils/customizationUtils';
import selectedOrganizationSelector from '../state/selectors/selectedOrganizationSelector';

const userIdSelector = state => state.auth.userId;
const organizationSelector = state => state.data.organizations;

export const selector = createStructuredSelector({
  userId: userIdSelector,
  organizations: organizationSelector,
  selectedOrganization: selectedOrganizationSelector,
});

export class UnconnectedAppContainer extends Component {
  constructor(props) {
    super(props);
    const mobileDetect = new MobileDetect(window.navigator.userAgent);
    if (mobileDetect.mobile()) {
      props.enableGeoposition();
    }
  }

  getChildContext() {
    return {
      location: this.props.location,
    };
  }

  componentDidMount() {
    if (this.props.userId) {
      this.props.fetchUser(this.props.userId);
    }
    this.props.actions.fetchOrganizations();
  }

  componentWillUpdate(nextProps) {
    if (nextProps.userId && nextProps.userId !== this.props.userId) {
      this.props.fetchUser(nextProps.userId);
    }
  }

  selectOrganization = (organization) => {
    this.props.actions.selectOrganization(organization);
  }

  render() {
    return (
      <BodyClassName className={getCustomizationClassName()} >
        <DocumentTitle title="Varaamo">
          <div className="app">
            <Header
              location={this.props.location}
              organizations={this.props.organizations}
              selectedOrganization={this.props.selectedOrganization}
              selectOrganization={this.selectOrganization}
            >
              <Favicon />
              <TestSiteMessage />
            </Header>
            <div className="app-content">
              <Grid>
                <Notifications />
              </Grid>
              {this.props.children}
            </div>
            <Footer />
          </div>
        </DocumentTitle>
      </BodyClassName>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.node,
  actions: PropTypes.object.isRequired,
  enableGeoposition: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  userId: PropTypes.string,
  organizations: PropTypes.object,
  selectOrganization: PropTypes.func,
  selectedOrganization: PropTypes.object,
};

UnconnectedAppContainer.childContextTypes = {
  location: React.PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = { enableGeoposition, fetchUser, fetchOrganizations, selectOrganization };
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(selector, mapDispatchToProps)(UnconnectedAppContainer);
