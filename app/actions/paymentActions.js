import pickBy from 'lodash/pickBy';
import { decamelizeKeys } from 'humps';
import { CALL_API } from 'redux-api-middleware';

import types from 'constants/ActionTypes';
import {
  buildAPIUrl,
  getErrorTypeDescriptor,
  getHeadersCreator,
  getRequestTypeDescriptor,
  getSuccessTypeDescriptor,
} from 'utils/apiUtils';

function parseOrderData(order) {
  const parsed = pickBy(order, value => value || value === 0);
  return JSON.stringify(decamelizeKeys(parsed));
}

function postOrder(order) {
  const url = buildAPIUrl('rp/order-post');
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(
          types.API.ORDER_POST_REQUEST,
          {
            countable: true,
            meta: { order },
          }
        ),
        getSuccessTypeDescriptor(
          types.API.ORDER_POST_SUCCESS,
          { countable: true }
        ),
        getErrorTypeDescriptor(
          types.API.ORDER_POST_ERROR,
          { countable: true, meta: { order } }
        ),
      ],
      endpoint: url,
      method: 'POST',
      headers: getHeadersCreator(),
      body: parseOrderData(order),
    },
  };
}

function fetchOrder(id, params = {}) {
  return {
    [CALL_API]: {
      types: [
        getRequestTypeDescriptor(types.API.ORDER_GET_REQUEST),
        getSuccessTypeDescriptor(
          types.API.ORDER_GET_SUCCESS,
        ),
        getErrorTypeDescriptor(types.API.ORDER_GET_ERROR),
      ],
      endpoint: buildAPIUrl(`orders/${id}`, params),
      method: 'GET',
      headers: getHeadersCreator(),
    },
  };
}


export {
  postOrder,
  fetchOrder,
};
