import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'react-bootstrap/lib/Button';
import DayPicker, { DateUtils } from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import { first, last, orderBy } from 'lodash';
import { browserHistory } from 'react-router';
import moment from 'moment';

import { injectT } from 'i18n';
import { addNotification } from 'actions/notificationsActions';
import {
  openConfirmReservationModal,
  selectReservationSlot,
  selectTimeRange,
  toggleTimeSlot,
  selectSku,
} from 'actions/uiActions';
import { getEditReservationUrl } from 'utils/reservationUtils';
import { hasMaxReservations } from 'utils/resourceUtils';
import reservationLongCalendarSelector from './reservationLongCalendarSelector';
import SkuChooser from '../sku-chooser/SkuChooser';


export class UnconnectedReservationLongCalendar extends Component {
  state = {
    from: undefined,
    to: undefined,
  }

  componentDidUpdate(nextProps) {
    const { from } = this.state;
    const { durationSlotId } = this.props;
    if (nextProps.durationSlotId !== durationSlotId) {
      this.setState({
        from: undefined,
        to: undefined,
      });
      if (nextProps.durationSlotId && from) {
        this.handleDayClick(from);
      }
    }
  }

  getDisabledDays = () => {
    const { availability, resource } = this.props;
    if (!resource.reservable) return [{ after: moment() }];

    const disabledDays = [];

    Object.keys(availability).forEach((key) => {
      if (availability[key].percentage === 0) {
        disabledDays.push(moment(key).toDate());
      }
    });

    let previousEnd;

    resource.openingPeriods.forEach((period) => {
      if (previousEnd) {
        const dayIterator = moment(previousEnd).add(1, 'days');
        const disabledEndDay = moment(period.start).subtract(1, 'days');
        if (disabledEndDay.isSameOrBefore(dayIterator)) {
          previousEnd = period.end;
          return;
        }
        while (!disabledEndDay.isSame(dayIterator, 'day')) {
          disabledDays.push(moment(dayIterator).toDate());
          dayIterator.add(1, 'days');
        }
      } else {
        disabledDays.push({
          before: moment(period.start).toDate(),
        });
      }
      previousEnd = period.end;
    });

    disabledDays.push({
      after: moment(previousEnd).add(1, 'days'),
    });

    return disabledDays;
  }

  getOverlapsDisabled = (begin, end) => {
    const beginM = moment(begin);
    const endM = moment(end);
    const disabledDays = this.getDisabledDays();
    let overlapsDisabled = false;
    disabledDays.forEach((dDay) => {
      if (moment(dDay).isBetween(beginM, endM)) {
        overlapsDisabled = true;
      }
    });
    return overlapsDisabled;
  }

  handleDayClick = (day, modifiers = {}) => {
    const { resource, actions, t, durationSlotId } = this.props;
    let range;

    if (resource.durationSlots.length && durationSlotId) {
      const slot = resource.durationSlots.find(durSlot => durationSlotId === durSlot.id);
      const slotDuration = moment.duration(slot.duration);
      const from = moment(day);
      const to = moment(day).add(slotDuration);

      range = {
        from: from.toDate(),
        to: to.toDate(),
      };
    } else if (resource.durationSlots.length && !durationSlotId) {
      actions.addNotification({
        message: t('ReservationLongCalendar.chooseSlotFirst'),
        type: 'info',
        timeOut: 10000,
      });
      return;
    } else {
      range = DateUtils.addDayToRange(day, this.state);
    }

    if (this.getOverlapsDisabled(range.from, range.to) || modifiers.disabled) {
      actions.addNotification({
        message: t('ReservationLongCalendar.overlapsDisabled'),
        type: 'error',
        timeOut: 10000,
      });
      return;
    }

    this.setState(range);

    const reservationData = {
      begin: moment(range.from).toISOString(),
      end: moment(range.to).toISOString(),
      resource: resource.id,
    };

    actions.selectTimeRange(reservationData);
  }

  handleReserveClick = () => {
    const { actions, isAdmin, resource, selected, t } = this.props;
    if (!isAdmin && hasMaxReservations(resource)) {
      actions.addNotification({
        message: t('TimeSlots.maxReservationsPerUser'),
        type: 'error',
        timeOut: 10000,
      });
    } else {
      const orderedSelected = orderBy(selected, 'begin');
      const { end } = last(orderedSelected);
      const reservation = Object.assign({}, first(orderedSelected), { end });
      const nextUrl = getEditReservationUrl(reservation);
      browserHistory.push(nextUrl);
    }
  }

  render() {
    const { t, availability, currentLanguage, actions, durationSlotId, resource } = this.props;
    const { from, to } = this.state;
    const modifiers = {
      start: from,
      end: to,
      available: (day) => {
        const dayDate = day.toISOString().substring(0, 10);
        return availability[dayDate] && availability[dayDate].percentage >= 80;
      },
      busy: (day) => {
        const dayDate = day.toISOString().substring(0, 10);
        return (
          availability[dayDate] &&
          availability[dayDate].percentage < 80 &&
          availability[dayDate].percentage > 0
        );
      },
      booked: (day) => {
        const dayDate = day.toISOString().substring(0, 10);
        return availability[dayDate] && availability[dayDate].percentage === 0;
      },
    };

    return (
      <div className="app-ReservationLongCalendar">
        <p>
          {!from && !to && t('ReservationLongCalendar.addStartDate')}
          {from && !to && t('ReservationLongCalendar.addEndDate')}
          {from && to &&
            `${t('ReservationLongCalendar.chosenBetween')} ${moment(from).format('D.M.YYYY')} -
                ${moment(to).format('D.M.YYYY')}`}{' '}
        </p>
        <div className="app-ResourcePage__bigCalendar">
          <DayPicker
            className="Selectable"
            disabledDays={[...this.getDisabledDays(), { before: moment() }]}
            locale={currentLanguage}
            localeUtils={MomentLocaleUtils}
            modifiers={modifiers}
            numberOfMonths={2}
            onDayClick={this.handleDayClick}
            selectedDays={[from, { from, to }]}
            showOutsideDays
            showWeekNumbers
          />
        </div>
        {
          from && to && (
            <div>
              <SkuChooser
                durationSlotId={durationSlotId}
                resourceId={resource.id}
                selectSku={actions.selectSku}
              />
              <Button
                bsStyle="primary"
                onClick={this.handleReserveClick}
              >
                {t('TimeSlots.reserveButton')}
              </Button>
            </div>
          )
        }
      </div>
    );
  }
}

UnconnectedReservationLongCalendar.propTypes = {
  availability: PropTypes.object.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  location: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    query: PropTypes.object.isRequired,
  }).isRequired,
  params: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
    id: PropTypes.string.isRequired,
  }).isRequired,
  durationSlotId: PropTypes.number,
  resource: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
};
UnconnectedReservationLongCalendar = injectT(UnconnectedReservationLongCalendar) // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    addNotification,
    openConfirmReservationModal,
    selectReservationSlot,
    toggleTimeSlot,
    selectTimeRange,
    selectSku,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(reservationLongCalendarSelector,
  mapDispatchToProps)(UnconnectedReservationLongCalendar);
