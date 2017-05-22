import isEqual from 'lodash/isEqual';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { geolocated, geoPropTypes } from 'react-geolocated';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchResources, toggleMap } from 'actions/searchActions';
import { changeSearchFilters } from 'actions/uiActions';
import { fetchUnits } from 'actions/unitActions';
import PageWrapper from 'pages/PageWrapper';
import DateHeader from 'shared/date-header';
import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';
import SearchControls from './controls';
import searchPageSelector from './searchPageSelector';
import SearchResults from './results';

class UnconnectedSearchPage extends Component {
  constructor(props) {
    super(props);
    this.scrollToSearchResults = this.scrollToSearchResults.bind(this);
    this.searchResources = this.searchResources.bind(this);
  }

  componentDidMount() {
    const { actions, filters } = this.props;
    this.searchResources(filters);
    actions.fetchUnits();
  }

  componentWillUpdate(nextProps) {
    const { filters: currentFilters, actions } = this.props;
    const { filters: nextFilters } = nextProps;
    if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
      this.searchResources(nextFilters);
      return;
    }
    if (isEqual(currentFilters, nextFilters)) {
      return;
    }
    actions.changeSearchFilters(nextFilters);
    this.searchResources(nextFilters);
  }

  scrollToSearchResults() {
    scrollTo(findDOMNode(this.refs.searchResults));
  }

  searchResources = (filters) => {
    const { actions, searchDone } = this.props;
    let searchFilters = filters;
    if (this.props.coords) {
      searchFilters = {
        ...filters,
        lat: this.props.coords.latitude,
        lon: this.props.coords.longitude,
      };
    }
    if (searchDone || filters.purpose || filters.people || filters.search) {
      actions.searchResources(searchFilters);
    }
  }

  render() {
    const {
      actions,
      filters,
      isFetchingSearchResults,
      location,
      params,
      searchResultIds,
      searchDone,
      showMap,
      t,
    } = this.props;

    return (
      <PageWrapper className="search-page" title={t('SearchPage.title')}>
        <h1>{t('SearchPage.title')}</h1>
        <SearchControls
          location={location}
          params={params}
          scrollToSearchResults={this.scrollToSearchResults}
        />
        {searchDone && <DateHeader date={filters.date} />}
        {searchDone || isFetchingSearchResults ?
          <SearchResults
            isFetching={isFetchingSearchResults}
            onToggleMap={actions.toggleMap}
            ref="searchResults"
            searchResultIds={searchResultIds}
            showMap={showMap}
          />
          : <p className="help-text">{t('SearchPage.helpText')}</p>
        }
      </PageWrapper>
    );
  }
}

UnconnectedSearchPage.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingSearchResults: PropTypes.bool.isRequired,
  filters: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  searchDone: PropTypes.bool.isRequired,
  searchResultIds: PropTypes.array.isRequired,
  showMap: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  ...geoPropTypes,
};

UnconnectedSearchPage = injectT(UnconnectedSearchPage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeSearchFilters,
    fetchUnits,
    searchResources,
    toggleMap,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedSearchPage };
export default connect(searchPageSelector, mapDispatchToProps)(geolocated()(UnconnectedSearchPage));
