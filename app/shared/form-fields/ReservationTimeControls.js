import moment from 'moment';
import 'moment-range';
import React, { Component, PropTypes } from 'react';
import Select from 'react-select';

import DatePicker from 'shared/date-picker';

function updateWithDate(initialValue, date) {
  const dateMoment = moment(date);
  return moment(initialValue).set({
    year: dateMoment.get('year'),
    month: dateMoment.get('month'),
    date: dateMoment.get('date'),
  }).toISOString();
}

function updateWithTime(initialValue, time, timeFormat) {
  const timeMoment = moment(time, timeFormat);
  return moment(initialValue).set({
    hour: timeMoment.get('hour'),
    minute: timeMoment.get('minute'),
  }).toISOString();
}

class ReservationTimeControls extends Component {
  static propTypes = {
    begin: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired,
    period: PropTypes.string,
    timeFormat: PropTypes.string,
  };

  static defaultProps = {
    period: '00:30:00',
    timeFormat: 'HH:mm',
  };

  constructor(props) {
    super(props);
    this.handleBeginTimeChange = this.handleBeginTimeChange.bind(this);
    this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
    this.handleBeginDateChange = this.handleBeginDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  getTimeOptions() {
    const { period, timeFormat } = this.props;
    const start = moment().startOf('day');
    const end = moment().endOf('day');
    const range = moment.range(moment(start), moment(end));
    const duration = moment.duration(period);
    const options = [];
    range.by(duration, (beginMoment) => {
      options.push({
        label: beginMoment.format(timeFormat),
        value: beginMoment.format(timeFormat),
      });
    });
    return options;
  }

  handleBeginTimeChange({ value }) {
    const { begin, timeFormat } = this.props;
    if (value) {
      begin.input.onChange(
        updateWithTime(begin.input.value, value, timeFormat)
      );
    }
  }

  handleEndTimeChange({ value }) {
    const { end, timeFormat } = this.props;
    if (value) {
      end.input.onChange(
        updateWithTime(end.input.value, value, timeFormat)
      );
    }
  }

  handleBeginDateChange(date) {
    const { begin } = this.props;
    begin.input.onChange(updateWithDate(begin.input.value, date));
  }

  handleEndDateChange(date) {
    const { end } = this.props;
    end.input.onChange(updateWithDate(end.input.value, date));
  }

  render() {
    const { begin, end, timeFormat } = this.props;

    return (
      <div className="reservation-time-controls">
        <div className="reservation-time-controls-date-control">
          <DatePicker
            onChange={this.handleBeginDateChange}
            value={begin.input.value}
          />
          <DatePicker
            onChange={this.handleEndDateChange}
            value={end.input.value}
          />
        </div>
        <div className="reservation-time-controls-time-control">
          <Select
            clearable={false}
            name="reservation-time-controls-begin-time-select"
            onChange={this.handleBeginTimeChange}
            options={this.getTimeOptions()}
            placeholder=" "
            searchable
            value={moment(begin.input.value).format(timeFormat)}
          />
        </div>
        <div className="reservation-time-controls-separator">
          -
        </div>
        <div className="reservation-time-controls-time-control">
          <Select
            clearable={false}
            name="reservation-time-controls-end-time-select"
            onChange={this.handleEndTimeChange}
            options={this.getTimeOptions()}
            placeholder=" "
            searchable
            value={moment(end.input.value).format(timeFormat)}
          />
        </div>
      </div>
    );
  }
}

export default ReservationTimeControls;
