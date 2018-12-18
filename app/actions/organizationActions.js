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

function fetchOrganizations() {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.ORGANIZATIONS_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.ORGANIZATIONS_GET_SUCCESS,
          { schema: schemas.paginatedOrganizationsSchema }
        ),
        getErrorTypeDescriptor(types.API.ORGANIZATIONS_GET_ERROR),
      ],
      endpoint: buildAPIUrl('organization'),
      method: 'GET',
      headers: getHeadersCreator(),
      bailout: state => !state.api.shouldFetch.organizations,
    },
  };
}

export {
  fetchOrganizations,
};
