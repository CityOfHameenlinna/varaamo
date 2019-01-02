import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import schemas from 'store/middleware/Schemas';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/apiUtils';

function fetchPurposes(selectedOrganization) {
  const params = selectedOrganization ? { organization: selectedOrganization } : {};
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.PURPOSES_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.PURPOSES_GET_SUCCESS,
          { schema: schemas.paginatedPurposesSchema }
        ),
        getErrorTypeDescriptor(types.API.PURPOSES_GET_ERROR),
      ],
      endpoint: buildAPIUrl('purpose', params),
      method: 'GET',
      headers: getHeadersCreator(),
      bailout: state => !state.api.shouldFetch.purposes,
    },
  };
}

export {
  fetchPurposes,
};
