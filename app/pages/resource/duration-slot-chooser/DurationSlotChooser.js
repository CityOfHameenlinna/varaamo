import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import moment from 'moment';

import { injectT } from 'i18n';
import durationSlotChooserSelector from './durationSlotChooserSelector';

class DurationSlotChooser extends Component {

  onChange = (selection) => {
    const { selectDurationSlot } = this.props;
    selectDurationSlot(selection.value === 'not_chosen' ? undefined : selection.value);
  }

  render() {
    const { t, resource, durationSlotId } = this.props;
    const options = resource.durationSlots.map((slot) => {
      const duration = moment.duration(slot.duration);
      return {
        value: slot.id,
        label: duration.asDays() >= 1 ?
          `${duration.asDays()} ${t('DurationSlotChooser.days')}` :
          `${duration.asHours()} ${t('DurationSlotChooser.hours')}`,
      };
    });

    const selectValue = durationSlotId || 'not_chosen';

    return (
      <div className="app-DurationSlotChooser">
        <Select
          clearable={false}
          name="duration-slot-chooser"
          onChange={this.onChange}
          options={[...options, { value: 'not_chosen', label: t('DurationSlotChooser.chooseReservationLength') }]}
          placeholder=""
          searchable={false}
          value={selectValue}
        />
      </div>
    );
  }
}

DurationSlotChooser.propTypes = {
  durationSlotId: PropTypes.number,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  selectDurationSlot: PropTypes.func.isRequired,
};

DurationSlotChooser = injectT(DurationSlotChooser) // eslint-disable-line

export default connect(durationSlotChooserSelector)(DurationSlotChooser);
