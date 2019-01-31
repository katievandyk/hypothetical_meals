import React from 'react';
import { Table } from 'reactstrap';

class CalculatorEntry extends React.Component {


  render() {
    return (
        <Table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Vendor Info</th>
              <th>Package Size</th>
              <th>Cost Per Package</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
           {this.props.ingredients.map(({ingredient, quantity}) => (
                 <tr key={ingredient._id}>
                    <td> {ingredient.name} </td>
                    <td> {ingredient.vendor_info} </td>
                    <td> {ingredient.package_size} </td>
                    <td> {ingredient.cost_per_package} </td>
                    <td> {ingredient.number} </td>
                    <td> {ingredient.quantity} </td>
                </tr>
           ))}
          </tbody>
        </Table>

    );
  }
}

export default CalculatorEntry;
