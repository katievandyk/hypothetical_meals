import React from 'react';
import { Button, Table } from 'reactstrap';

class CalculatorEntry extends React.Component {

  render() {
    return (
        <div>
        <Table id= "toPDF">
          <thead>
            <tr>
              <th title="Ingredient">Ingredient</th>
              <th title="Vendor">Vendor Info</th>
              <th title="Package Size">Package Size</th>
              <th title="Cost Per Package">Cost Per Package</th>
              <th title="Quantity">Quantity</th>
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
       </div>
    );
  }
}

export default CalculatorEntry;