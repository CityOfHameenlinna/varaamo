import isEmpty from 'lodash/isEmpty';
import mapValues from 'lodash/mapValues';
import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

import {
  isAdminSelector,
} from 'state/selectors/authSelectors';
import { createResourceSelector } from 'state/selectors/dataSelectors';
import { currentLanguageSelector } from 'state/selectors/translationSelectors';
import { getOpenReservations } from 'utils/resourceUtils';

const resourceIdSelector = (state, props) => props.resourceId;
const resourceSelector = createResourceSelector(resourceIdSelector);
const selectedSelector = state => state.ui.reservations.selected;
const durationSlotIdSelector = state => state.ui.reservations.durationSlotId;

const AvailabilitySelector = createSelector(
  resourceSelector,
  (resource) => {
    if (isEmpty(resource)) {
      return resource;
    }
    const availableTimeByDate = {};
    (resource.openingHours || []).forEach(({ closes, date, opens }) => {
      const openMinutes = moment.duration(
        moment(closes).diff(moment(opens))
      ).asMinutes();
      if (availableTimeByDate[date]) {
        availableTimeByDate[date].openMinutes += openMinutes;
      } else {
        availableTimeByDate[date] = {
          reservedMinutes: 0,
        };
      }
    });
    getOpenReservations(resource).forEach(({ begin, end }) => {
      const dates = [];
      const beginDT = moment(begin);
      const endDT = moment(end);
      const currentDT = moment(begin);
      while (currentDT.isSameOrBefore(endDT, 'day')) {
        dates.push(currentDT.format('YYYY-MM-DD'));
        currentDT.add(1, 'days');
      }
      dates.forEach((date) => {
        if (availableTimeByDate[date]) {
          const isBeginOrEndDate = beginDT.isSame(date, 'day') || endDT.isSame(date, 'day');
          const isHalfReserved = availableTimeByDate[date].percentage === 50;
          availableTimeByDate[date].percentage = isBeginOrEndDate && !isHalfReserved ? 50 : 0;
        }
      });
    });
    return mapValues(availableTimeByDate, date => ({
      ...date,
      percentage: date.percentage,
    }));
  }
);

const reservationLongCalendarSelector = createStructuredSelector({
  availability: AvailabilitySelector,
  currentLanguage: currentLanguageSelector,
  resource: resourceSelector,
  isAdmin: isAdminSelector,
  selected: selectedSelector,
  durationSlotId: durationSlotIdSelector,
});

export default reservationLongCalendarSelector;
