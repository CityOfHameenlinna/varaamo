import React, { Component, PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Well from 'react-bootstrap/lib/Well';

import { injectT } from 'i18n';

class ReservationPayment extends Component {
  static propTypes = {
    handleOrder: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    this.props.handleOrder();
  }

  render() {
    const { t } = this.props;
    return (
      <Row>
        <Col md={12} xs={12}>
          <Well>
            <h2>
              {t('ReservationPayment.reservationDetailsTitle')}
            </h2>
          </Well>
        </Col>
      </Row>
    );
  }
}

export default injectT(ReservationPayment);
