import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

class GoalsSKUDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      validName: '',
      selected:{}
    };
  }

  changeValue = (e) =>{
    var skus = [];
    if(this.props.skus){
      skus = this.props.skus.skus;
    }
    var selSku = skus.find((sku) => sku._id === e.value);
    var valid = '';
    if(selSku != null && this.props.skus_list.find(elem => elem.sku._id === e.value) == null) {
      valid = 'success'
      this.props.callbackFromParent(selSku)
    }
    else {
      valid = 'failure'
    }
    this.setState({ validName: valid, selected: e })
  }

  classNameValue = () => {
    if(this.state.validName === 'failure'){
      return "isInvalid";
    }
    else if(this.state.validName === 'success'){
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
    var skus = this.props.skus.skus;
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

GoalsSKUDropdown.propTypes = {
  skus: PropTypes.object.isRequired,
  skus_list: PropTypes.array.isRequired
};

export default GoalsSKUDropdown;
