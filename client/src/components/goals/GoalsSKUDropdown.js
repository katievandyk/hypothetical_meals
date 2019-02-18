import React from 'react';
import { Input } from 'reactstrap';

class GoalsSKUDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.changeValue = this.changeValue.bind(this);
    this.state = {
      dropdownOpen: false,
      valid: ''
    };
  }

  changeValue(e) {
    const { skus } = this.props.skus
    var selSku = skus.find((sku) => sku._id === e.currentTarget.value)
    var valid = '';
    if(selSku != null && this.props.skus_list.find(elem => elem.sku._id === e.currentTarget.value) == null) {
      valid = 'success'
      this.props.callbackFromParent(selSku)
    }
    else {
      valid = 'failure'
    }
    this.setState({ validName: valid })
  }

  render() {
    const { skus } = this.props.skus;
    return (
        <Input type="select" onChange={e => this.changeValue(e)} valid={this.state.validName === 'success'} invalid={this.state.validName === 'failure'}>
             <option>Select a SKU</option>
             {skus.map(({_id, name, unit_size, count_per_case}) => (
                <option id={_id} value={_id}> {name}: {unit_size} * {count_per_case} </option>
            ))}
        </Input>
    );
  }
}


export default GoalsSKUDropdown;