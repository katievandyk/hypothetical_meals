import React from 'react';
import Select from 'react-select';

class GoalsSKUDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      valid: ''
    };
  }

  changeValue(e) {
    const { skus } = this.props.skus
    var selSku = skus.find((sku) => sku._id === e.value)
    var valid = '';
    if(selSku != null && this.props.skus_list.find(elem => elem.sku._id === e.value) == null) {
      valid = 'success'
      this.props.callbackFromParent(selSku)
    }
    else {
      valid = 'failure'
    }
    this.setState({ validName: valid })
  }

  classNameValue = () => {
    if(this.state.validName === 'failure'){
      return "isInvalid";
    }
    else if(this.props.validName === 'success'){
      return "isValid";
    }
    else
      return "";
  }

  genOptions = (skus) => {
    var newOptions = [];
    skus.forEach(function(sku){
      var newOption = {value: sku._id, label: sku.name+": " + sku.unit_size + " * " + sku.count_per_case  + " (SKU#: " + sku.number +")"};
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  render() {
    const { skus } = this.props.skus;
    return (
      <Select
        className={this.classNameValue()}
        classNamePrefix="react-select"
        options={this.genOptions(skus)}
        onChange={this.changeValue}
        name="formula"
        placeholder="Select Formula"
        />
    );
  }
}


export default GoalsSKUDropdown;
