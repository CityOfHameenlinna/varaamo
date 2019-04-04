import { createStructuredSelector } from 'reselect';

import { createResourceSelector } from 'state/selectors/dataSelectors';

const resourceIdSelector = (state, props) => props.resourceId;
const resourceSelector = createResourceSelector(resourceIdSelector);
const skuIdSelector = state => state.ui.reservations.skuId;

const skuChooserSelector = createStructuredSelector({
  resource: resourceSelector,
  skuId: skuIdSelector,
});

export default skuChooserSelector;
