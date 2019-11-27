import classNames from 'classnames';
import React, { PureComponent, PropTypes } from 'react';
import moment from 'moment';
import { each } from 'lodash';
import { findDOMNode } from 'react-dom';

import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';
import { padLeft } from 'utils/timeUtils';
import utils from '../utils';

class TimeSlot extends PureComponent {
  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    allSelectedSlots: PropTypes.array,
    isAdmin: PropTypes.bool.isRequired,
    showClear: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isSelectable: PropTypes.bool.isRequired,
    onClear: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func.isRequired,
    onMouseLeave: PropTypes.func.isRequired,
    durationSlotId: PropTypes.number,
    resource: PropTypes.object.isRequired,
    scrollTo: PropTypes.bool,
    selected: PropTypes.bool.isRequired,
    slot: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.props.scrollTo) {
      scrollTo(findDOMNode(this));
    }
  }

  getReservationInfoNotification(isLoggedIn, resource, slot, t, durationSlotId, allSelectedSlots) {
    if (new Date(slot.end) < new Date() || slot.reserved || !!allSelectedSlots.length) {
      return null;
    }
    if (!!resource.reservable && !!resource.durationSlots.length && !durationSlotId) {
      return {
        message: t('ReservationLongCalendar.chooseSlotFirst'),
        type: 'info',
        timeOut: 10000,
      };
    } else if (!!resource.reservable && !isLoggedIn) {
      return {
        message: t('Notifications.loginToReserve'),
        type: 'info',
        timeOut: 10000,
      };
    }
    return {
      message: resource.reservationInfo,
      type: 'info',
      timeOut: 10000,
    };
  }

  checkOverlapsDisabled = (begin, end) => {
    const {
      resource,
    } = this.props;

    let overlapsDisabled = false;

    if (!moment(begin).isSame(moment(end), 'day')) {
      overlapsDisabled = true;
    }

    const currentDateTime = moment(begin);

    const checkReservationOverlap = (reservation) => {
      const resBegin = moment(reservation.begin);
      const resEnd = moment(reservation.end);
      if (currentDateTime.isBetween(resBegin, resEnd) ||
      currentDateTime.isBetween(resBegin, resEnd)) {
        overlapsDisabled = true;
      }
    };

    while (currentDateTime.isBefore(end)) {
      const slot = {
        start: currentDateTime.toISOString(),
        end: currentDateTime.add(moment.duration(resource.minPeriod)).toISOString(),
        resource: resource.id,
      };

      if (!utils.isInsideOpeningHours(slot, resource.openingHours)) {
        overlapsDisabled = true;
      }
      each(resource.reservations, checkReservationOverlap);
    }

    return overlapsDisabled;
  }

  handleClick = (disabled) => {
    const {
      addNotification,
      allSelectedSlots,
      isLoggedIn,
      onClick,
      resource,
      durationSlotId,
      slot,
      t,
    } = this.props;

    if (disabled) {
      const notification = this.getReservationInfoNotification(
        isLoggedIn,
        resource,
        slot,
        t,
        durationSlotId,
        allSelectedSlots
      );
      if (notification && notification.message) {
        addNotification(notification);
      }
    } else if (durationSlotId) {
      if (allSelectedSlots.length > 0) {
        onClick(allSelectedSlots[0]);
        if (allSelectedSlots.length > 1) {
          onClick(allSelectedSlots[allSelectedSlots.length - 1]);
        }
        return;
      }
      const durationSlot = resource.durationSlots.find(
        durSlot => durationSlotId === durSlot.id
      );

      const durationSlotDuration = moment.duration(durationSlot.duration);
      const minResPeriodDuration = moment.duration(resource.minPeriod);

      const endSlotBegin = moment(slot.start)
        .add(durationSlotDuration)
        .subtract(minResPeriodDuration);
      const endSlotEnd = moment(slot.start).add(durationSlotDuration);

      if (this.checkOverlapsDisabled(slot.start, endSlotEnd)) {
        addNotification({
          message: t('ReservationLongCalendar.overlapsDisabled'),
          type: 'error',
          timeOut: 10000,
        });
        return;
      }

      onClick({
        begin: slot.start,
        end: slot.end,
        resource: resource.id,
      });

      onClick({
        begin: endSlotBegin.toISOString(),
        end: endSlotEnd.toISOString(),
        resource: resource.id,
      });
    } else {
      onClick({
        begin: slot.start,
        end: slot.end,
        resource: resource.id,
      });
    }
  };

  render() {
    const {
      allSelectedSlots,
      isAdmin,
      showClear,
      isHighlighted,
      isLoggedIn,
      isSelectable,
      onClear,
      onMouseEnter,
      onMouseLeave,
      durationSlotId,
      resource,
      selected,
      slot,
    } = this.props;
    const isPast = new Date(slot.end) < new Date();
    const disabled =
      (!durationSlotId && resource.durationSlots.length > 0) ||
      (durationSlotId && allSelectedSlots.length > 0 && !selected) ||
      (!isLoggedIn && resource.authentication !== 'unauthenticated') ||
      (!isSelectable && !selected) ||
      !resource.userPermissions.canMakeReservations ||
      (!slot.editing && (slot.reserved || isPast));
    const reservation = slot.reservation;
    const isOwnReservation = reservation && reservation.isOwn;
    const start = new Date(slot.start);
    const startTime = `${padLeft(start.getHours())}:${padLeft(start.getMinutes())}`;

    return (
      <div
        className={classNames('app-TimeSlot', {
          'app-TimeSlot--disabled': disabled,
          'app-TimeSlot--is-admin': isAdmin,
          'app-TimeSlot--editing': slot.editing,
          'app-TimeSlot--past': isPast,
          'app-TimeSlot--own-reservation': isOwnReservation,
          'app-TimeSlot--reservation-starting':
            (isAdmin || isOwnReservation) && slot.reservationStarting,
          'app-TimeSlot--reservation-ending':
            (isAdmin || isOwnReservation) && slot.reservationEnding,
          'app-TimeSlot--reserved': slot.reserved,
          'app-TimeSlot--selected': selected,
          'app-TimeSlot--highlight': isHighlighted,
        })}
      >
        <button
          className="app-TimeSlot__action"
          onClick={() => this.handleClick(disabled)}
          onMouseEnter={() => !disabled && onMouseEnter(slot)}
          onMouseLeave={() => !disabled && onMouseLeave()}
        >
          <span className="app-TimeSlot__icon" />
          <time dateTime={slot.asISOString}>{startTime}</time>
        </button>
        {showClear && (
          <button className="app-TimeSlot__clear" onClick={onClear}>
            <span className="app-TimeSlot__clear-icon" />
          </button>
        )}
      </div>
    );
  }
}

export default injectT(TimeSlot);
