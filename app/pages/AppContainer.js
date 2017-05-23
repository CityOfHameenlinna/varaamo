import React, { Component, PropTypes } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import DocumentTitle from 'react-document-title';
import { geolocated } from 'react-geolocated';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchUser } from 'actions/userActions';
import Favicon from 'shared/favicon';
import TestSiteMessage from 'shared/test-site-message';
import Footer from 'shared/footer';
import Navbar from 'shared/navbar';
import Notifications from 'shared/notifications';
import { getCustomizationClassName } from 'utils/customizationUtils';

const userIdSelector = state => state.auth.userId;
export const selector = createStructuredSelector({
  userId: userIdSelector,
});

export class UnconnectedAppContainer extends Component {
  getChildContext() {
    return {
      location: this.props.location,
      coords: this.props.coords,
    };
  }

  componentDidMount() {
    if (this.props.userId) {
      this.props.fetchUser(this.props.userId);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.userId && nextProps.userId !== this.props.userId) {
      this.props.fetchUser(nextProps.userId);
    }
  }

  render() {
    return (
      <DocumentTitle title="Varaamo">
        <div className={`app ${getCustomizationClassName()}`}>
          <Favicon />
          <TestSiteMessage />
          <Navbar />
          <div className="app-content">
            <Grid>
              <Notifications />
            </Grid>
            {this.props.children}
          </div>
          <Footer />
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedAppContainer.propTypes = {
  children: PropTypes.node,
  coords: React.PropTypes.object,
  fetchUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  userId: PropTypes.string,
};

UnconnectedAppContainer.childContextTypes = {
  coords: React.PropTypes.object,
  location: React.PropTypes.object,
};

const actions = { fetchUser };
export default connect(selector, actions)(geolocated()(UnconnectedAppContainer));
