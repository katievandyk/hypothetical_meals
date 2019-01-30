import React from 'react';
import { Table } from 'reactstrap';

class CalculatorEntry extends React.Component {


  render() {
    return (
        <Table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
           {this.props.ingredients.map(({_id, ingredient, quantity}) => (
                <tr key={_id}>
                {ingredient.map(({name}) => (
                    <td> {name} </td>
                ))}
                <td> {quantity} </td>
                </tr>
           ))}
          </tbody>
        </Table>

    );
  }
}


export default CalculatorEntry;