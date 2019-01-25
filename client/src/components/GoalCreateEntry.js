import React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class GoalCreateEntry extends React.Component {

  constructor() {
    super();
    this.state = {
        skus: [{sku: {name: "hi"}}]
    }
  }

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
          </thead>
          <tbody>
             {this.state.skus.map(({sku, quantity}) => (
                 <tr>
                    <td> {sku.name} ({quantity}) </td>
                 </tr>
             ))}
          </tbody>
        </Table>

    );
  }
}


export default GoalCreateEntry;
