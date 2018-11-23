import React, { PropTypes } from 'react';
import moment from 'moment';

import iconClock from 'assets/icons/clock-o.svg';

function ReservationDate({ beginDate, endDate }) {
  if (!beginDate || !endDate) {
    return <span />;
  }
  const reservationBegin = moment(beginDate);
  const reservationEnd = moment(endDate);
  const beginDay = reservationBegin.format('D');
  const endDay = reservationEnd.format('D');
  const beginDayOfWeek = reservationBegin.format('dddd');
  const endDayOfWeek = reservationEnd.format('dddd');
  const beginMonth = reservationBegin.format('MMMM');
  const endMonth = reservationEnd.format('MMMM');
  const beginTime = reservationBegin.format('HH:mm');
  const endTime = reservationEnd.format('HH:mm');
  const hours = reservationEnd.diff(reservationBegin, 'hours', true);

  if (reservationBegin.isSame(reservationEnd, 'day')) {
    return (
      <div className="reservation-date">
        <div className="reservation-date__content">
          <h5 className="reservation-date__month">{beginMonth}</h5>
          <h1>{beginDay}</h1>
          <h5 className="reservation-date__day-of-week">{beginDayOfWeek}</h5>
        </div>
        <h3>
          <img alt="" className="reservation-date__icon" src={iconClock} />
          {` ${beginTime} \u2013 ${endTime} (${hours}h)`}
        </h3>
      </div>
    );
  }
  return (
    <div className="reservation-date">
      <div className="reservation-date__container">
        <div className="reservation-date__content">
          <h5 className="reservation-date__month">{beginMonth}</h5>
          <h1>{beginDay}</h1>
          <h5 className="reservation-date__day-of-week">{beginDayOfWeek}</h5>
        </div>
        <div>
          <h1>-</h1>
        </div>
        <div className="reservation-date__content">
          <h5 className="reservation-date__month">{endMonth}</h5>
          <h1>{endDay}</h1>
          <h5 className="reservation-date__day-of-week">{endDayOfWeek}</h5>
        </div>
      </div>
    </div>
  );
}

ReservationDate.propTypes = {
  beginDate: PropTypes.string,
  endDate: PropTypes.string,
};

export default ReservationDate;
