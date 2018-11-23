import { createStructuredSelector } from 'reselect';

import { createResourceSelector } from 'state/selectors/dataSelectors';

const resourceIdSelector = (state, props) => props.resourceId;
const resourceSelector = createResourceSelector(resourceIdSelector);
const durationSlotIdSelector = state => state.ui.reservations.durationSlotId;

const durationSlotChooserSelector = createStructuredSelector({
  resource: resourceSelector,
  durationSlotId: durationSlotIdSelector,
});

export default durationSlotChooserSelector;
