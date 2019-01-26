import React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class CalculatorEntry extends React.Component {


  render() {
    return (
      /**
        **/

        <Table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </Table>

    );
  }
}


export default CalculatorEntry;
