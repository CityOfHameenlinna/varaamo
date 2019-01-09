import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import { isAdminSelector, isLoggedInSelector } from 'state/selectors/authSelectors';
import { createResourceSelector, unitsSelector } from 'state/selectors/dataSelectors';
import dateSelector from 'state/selectors/dateSelector';
import selectedOrganizationSelector from 'state/selectors/selectedOrganizationSelector';
import requestIsActiveSelectorFactory from 'state/selectors/factories/requestIsActiveSelectorFactory';

const resourceIdSelector = (state, props) => props.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const showMapSelector = state => state.ui.resourceMap.showMap;
const unitSelector = createSelector(
  resourceSelector,
  unitsSelector,
  (resource, units) => units[resource.unit] || {}
);

const resourcePageSelector = createStructuredSelector({
  date: dateSelector,
  id: resourceIdSelector,
  isAdmin: isAdminSelector,
  isFetchingResource: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  resource: resourceSelector,
  showMap: showMapSelector,
  unit: unitSelector,
  selectedOrganization: selectedOrganizationSelector,
});

export default resourcePageSelector;
