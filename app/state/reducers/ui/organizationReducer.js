import Immutable from 'seamless-immutable';

import types from 'constants/ActionTypes';

const initialState = Immutable({
  selectedOrganization: {},
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
