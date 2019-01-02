import get from 'lodash/get';
import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const persistedData = JSON.parse(localStorage.getItem('redux-localstorage'));
const persistedOrganization = get(persistedData, 'ui.organization.selectedOrganization');

const initialState = Immutable({
  selectedOrganization: persistedOrganization,
});

function organizationReducer(state = initialState, action) {
  let organization;

  switch (action.type) {

    case types.UI.SELECT_ORGANIZATION: {
      organization = action.payload;
      return state.merge({ selectedOrganization: organization });
    }

    default: {
      return state;
    }
  }
}

export default organizationReducer;
