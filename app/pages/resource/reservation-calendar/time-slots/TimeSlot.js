import classNames from 'classnames';
import moment from 'moment';
import { each } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import { injectT } from 'i18n';
import { scrollTo } from 'utils/domUtils';
import utils from '../utils';

class TimeSlot extends Component {
  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    allSelectedSlots: PropTypes.array,
    isAdmin: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isSelectable: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
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

  getReservationInfoNotification(isLoggedIn, resource, slot, t) {
    if (moment(slot.end) < moment() || slot.reserved) {
      return null;
    }

    if (!isLoggedIn && resource.reservable) {
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
      const notification = this.getReservationInfoNotification(isLoggedIn, resource, slot, t);
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
  }

  render() {
    const {
      allSelectedSlots,
      isAdmin,
      isLoggedIn,
      isSelectable,
      durationSlotId,
      resource,
      selected,
      slot,
    } = this.props;
    const isPast = moment(slot.end) < moment();
    const disabled = (
      (!durationSlotId && resource.durationSlots.length > 0) ||
      (durationSlotId && allSelectedSlots.length > 0 && !selected) ||
      (!isLoggedIn && resource.authentication !== 'unauthenticated') ||
      (!isSelectable && !selected) ||
      !resource.userPermissions.canMakeReservations ||
      (!slot.editing && (slot.reserved || isPast))
    );
    const reservation = slot.reservation;
    const isOwnReservation = reservation && reservation.isOwn;
    return (
      <button
        className={classNames('app-TimeSlot', {
          'app-TimeSlot--disabled': disabled,
          'app-TimeSlot--is-admin': isAdmin,
          'app-TimeSlot--editing': slot.editing,
          'app-TimeSlot--past': isPast,
          'app-TimeSlot--own-reservation': isOwnReservation,
          'app-TimeSlot--reservation-starting': (isAdmin || isOwnReservation) && slot.reservationStarting,
          'app-TimeSlot--reservation-ending': (isAdmin || isOwnReservation) && slot.reservationEnding,
          'app-TimeSlot--reserved': slot.reserved,
          'app-TimeSlot--selected': selected,
        })}
        onClick={() => this.handleClick(disabled)}
      >
        <span className="app-TimeSlot--icon" />
        <time dateTime={slot.asISOString}>
          {moment(slot.start).format('HH:mm')}
        </time>
      </button>
    );
  }
}

export default injectT(TimeSlot);
