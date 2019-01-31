import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import moment from 'moment';
import classnames from 'classnames';
import findIndex from 'lodash/findIndex';
import minBy from 'lodash/minBy';

import constants from 'constants/AppConstants';
import { injectT } from 'i18n';
import ReservationPopover from 'shared/reservation-popover';
import TimeSlot from './TimeSlot';
import TimeSlotPlaceholder from './TimeSlotPlaceholder';
import utils from '../utils';

class TimeSlots extends Component {
  static propTypes = {
    addNotification: PropTypes.func.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    onClear: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
    durationSlotId: PropTypes.number,
    resource: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    selectedDate: PropTypes.string.isRequired,
    slots: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    time: PropTypes.string,
  };

  state = {
    hoveredTimeSlot: null,
  };

  onClear = () => {
    const { onClear } = this.props;
    onClear();
    this.setState(() => ({ hoveredTimeSlot: null }));
  };

  onCancel = () => {
    const { onClick, selected } = this.props;
    if (selected.length < 1) {
      return;
    }
    onClick(selected[0]);
  };

  onMouseEnter = (hoveredTimeSlot) => {
    if (this.props.selected.length !== 1) {
      return;
    }
    this.setState(() => ({
      hoveredTimeSlot,
    }));
  };

  onMouseLeave = () => {
    if (this.props.selected.length !== 1) {
      return;
    }
    this.setState(() => ({
      hoveredTimeSlot: null,
    }));
  };

  getReservationBegin = () => {
    const { selected } = this.props;
    if (selected.length < 1) {
      return '';
    }

    return selected[0].begin;
  };

  getReservationEnd = () => {
    const { selected } = this.props;
    const { hoveredTimeSlot } = this.state;
    if (selected.length < 1) {
      return '';
    }
    if (!hoveredTimeSlot) {
      return selected[selected.length - 1].end;
    }
    return hoveredTimeSlot.end;
  };

  calculatePlaceholders(selectedDate, slots) {
    const firstTimeSlots = slots
      .map(timeslots => timeslots && timeslots[0])
      .filter(value => !!value && value.end);

    if (firstTimeSlots.length === 0) {
      return {
        mobilePlaceholderOffset: 0,
        timeSlotPlaceholderSizes: Array(slots.length).fill(0),
      };
    }

    const earliestTimeSlot = minBy(firstTimeSlots, timeSlot =>
      moment(timeSlot.start).format('HHMM')
    );
    const dateForTimeComparison = { year: 2000, dayOfYear: 1 };
    const earliestStart = moment(earliestTimeSlot.start).set(dateForTimeComparison);

    const timeSlotPlaceholderSizes = slots.map((slot) => {
      if (!slot[0] || !slot[0].end) {
        return null;
      }
      const currentStart = moment(slot[0].start).set(dateForTimeComparison);
      return currentStart.diff(earliestStart, 'minutes') / 30;
    });

    const selectedDateIndex = findIndex(
      slots,
      slot => !!slot[0] && moment(slot[0].start).format(constants.DATE_FORMAT) === selectedDate
    );

    const mobilePlaceholderSizes = timeSlotPlaceholderSizes
      .slice(selectedDateIndex, selectedDateIndex + 3)
      .filter(size => size !== null);

    const mobilePlaceholderOffset =
      mobilePlaceholderSizes.length > 0 ? Math.min(...mobilePlaceholderSizes) : 0;

    return {
      mobilePlaceholderOffset,
      timeSlotPlaceholderSizes,
    };
  }

  renderTimeSlots = () => {
    const { selected, selectedDate, slots } = this.props;
    let lastSelectableFound = false;

    const { mobilePlaceholderOffset, timeSlotPlaceholderSizes } = this.calculatePlaceholders(
      selectedDate,
      slots
    );

    return slots.map((timeSlots, index) => {
      if (!timeSlots.length) {
        return null;
      }
      const slot = timeSlots[0];
      const placeholderSize = timeSlotPlaceholderSizes[index];

      const slotDate = moment(slot.start).format(constants.DATE_FORMAT);
      const nextFromSelectedDate = utils.getNextDayFromDate(selectedDate);
      const secondFromSelectedDate = utils.getSecondDayFromDate(selectedDate);
      const isNextWeek = moment(slot.start).week() !== moment(selectedDate).week();
      const className = classnames('app-TimeSlots--date', {
        'app-TimeSlots--date--selected': slotDate === selectedDate,
        'app-TimeSlots--date--selected--next--day': slotDate === nextFromSelectedDate,
        'app-TimeSlots--date--selected--second--day': slotDate === secondFromSelectedDate,
        'app-TimeSlots--date--selected--next--week': isNextWeek,
      });

      return (
        <div className={className} key={`dateslot-${index}`}>
          <h6 className="app-TimeSlots--date--header">
            {slot && slot.start ? moment(slot.start).format('dd D.M') : ''}
          </h6>

          {!!placeholderSize && (
            <TimeSlotPlaceholder mobileOffset={mobilePlaceholderOffset} size={placeholderSize} />
          )}

          {timeSlots.map((timeSlot) => {
            if (!lastSelectableFound && selected.length && timeSlot.reserved) {
              lastSelectableFound = utils.isSlotAfterSelected(timeSlot, selected);
            }
            return this.renderTimeSlot(timeSlot, lastSelectableFound);
          })}
        </div>
      );
    });
  };

  renderTimeSlot = (slot, lastSelectableFound) => {
    const {
      addNotification,
      isAdmin,
      isEditing,
      isLoggedIn,
      onClick,
      durationSlotId,
      resource,
      selected,
      t,
      time,
    } = this.props;
    const { hoveredTimeSlot } = this.state;
    if (!slot.end) {
      return (
        <h6 className="app-TimeSlots--closed" key={slot.start}>
          {t('TimeSlots.closedMessage')}
        </h6>
      );
    }
    const scrollTo = time && time === slot.start;
    const isSelectable = utils.isSlotSelectable(
      slot,
      selected,
      resource,
      lastSelectableFound,
      isAdmin
    );
    const isSelected = utils.isSlotSelected(slot, selected);
    const isFirstSelected = utils.isFirstSelected(slot, selected);
    const shouldShowReservationPopover = selected.length === 1 && isFirstSelected;
    const isHighlighted = utils.isHighlighted(slot, selected, hoveredTimeSlot);

    const timeSlot = (
      <TimeSlot
        addNotification={addNotification}
        allSelectedSlots={selected}
        durationSlotId={durationSlotId}
        isAdmin={isAdmin}
        isEditing={isEditing}
        isHighlighted={isHighlighted}
        isLoggedIn={isLoggedIn}
        isSelectable={isSelectable}
        key={slot.start}
        onClear={this.onClear}
        onClick={onClick}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        resource={resource}
        scrollTo={scrollTo}
        selected={isSelected}
        showClear={isFirstSelected}
        slot={slot}
      />
    );

    return shouldShowReservationPopover ? (
      <ReservationPopover
        begin={this.getReservationBegin()}
        end={this.getReservationEnd()}
        key="timeslots-reservation-popover"
        onCancel={this.onCancel}
      >
        {timeSlot}
      </ReservationPopover>
    ) : (
      timeSlot
    );
  };

  render() {
    const { isFetching } = this.props;

    return (
      <Loader loaded={!isFetching}>
        <div className="app-TimeSlots">{this.renderTimeSlots()}</div>
      </Loader>
    );
  }
}

TimeSlots = injectT(TimeSlots); // eslint-disable-line

export default TimeSlots;
