import { createStructuredSelector } from 'reselect';

import urlSearchFiltersSelector from 'state/selectors/urlSearchFiltersSelector';

const OrganizationSelector = state => state.ui.organization;

const searchResultsSelector = createStructuredSelector({
  filters: urlSearchFiltersSelector,
  selectedOrganization: OrganizationSelector,
});

export default searchResultsSelector;
