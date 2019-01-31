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
        <Table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
             {this.state.skus.map(({sku, quantity}) => (
                <td key={sku._id}> {sku.name} ({quantity}) </td>
             ))}
          </tbody>
        </Table>

    );
  }
}


export default GoalCreateEntry;
