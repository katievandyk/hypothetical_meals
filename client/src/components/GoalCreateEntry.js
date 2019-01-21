import React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class GoalCreateEntry extends React.Component {

  render() {
    return (
      /**
        **/

        <Table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Quantity</th>
            </tr>
            <td> example sku</td>
          </thead>
          <tbody>
          </tbody>
        </Table>

    );
  }
}

export default GoalCreateEntry;
