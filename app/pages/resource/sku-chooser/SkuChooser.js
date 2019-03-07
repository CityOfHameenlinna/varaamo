import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { injectT } from 'i18n';
import skuChooserSelector from './skuChooserSelector';

class SkuChooser extends Component {

  onChange = (selection) => {
    const { selectSku } = this.props;
    selectSku(selection.value === 'not_chosen' ? undefined : selection.value);
  }

  render() {
    const { t, resource, durationSlotId, skuId } = this.props;
    const skus = resource.durationSlots.find(durSlot => durationSlotId === durSlot.id).skus;
    const options = skus.map(sku => ({ value: sku.id, label: sku.name }));

    const selectValue = skuId || 'not_chosen';

    return (
      <div className="app-SkuChooser">
        <Select
          clearable={false}
          name="duration-slot-chooser"
          onChange={this.onChange}
          options={[...options, { value: 'not_chosen', label: t('SkuChooser.chooseReservationLength') }]}
          placeholder=""
          searchable={false}
          value={selectValue}
        />
      </div>
    );
  }
}

SkuChooser.propTypes = {
  durationSlotId: PropTypes.number,
  skuId: PropTypes.number,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  selectSku: PropTypes.func.isRequired,
};

SkuChooser = injectT(SkuChooser) // eslint-disable-line

export default connect(skuChooserSelector)(SkuChooser);