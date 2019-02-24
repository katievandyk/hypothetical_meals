import React from 'react';
import {
  FormGroup, Label
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPLines } from '../../actions/plineActions';
import Select from 'react-select';

class SKUsFormPLineSelection extends React.Component {
  componentDidMount() {
    this.props.getPLines(1, -1);
  }

  onChange = (e) => {
    this.props.onProductLineChange(e.value, true);
  }

  classNameValue = () => {
    if(this.props.validate === 'is-empty'){
      return "isInvalid";
    }
    else if(this.props.validate === 'has-success'){
      return "isValid";
    }
    else
      return "";
  }

  genOptions = (plines) => {
    var newOptions = [];
    plines.forEach(function(pline){
      var newOption = {value: pline._id, label: pline.name};
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  render() {
    var defaultValue = "";
    if(this.props.defaultValue){
      defaultValue = {value: this.props.defaultValue._id, label: this.props.defaultValue.name}
    }
    var validate = this.props.validate;
    return(<FormGroup>
        <Label for="product_line">Product Line</Label>
        <Select
          className={this.classNameValue()}
          classNamePrefix="react-select"
          options={this.genOptions(this.props.plines.plines)}
          onChange={this.onChange}
          placeholder="Select Product Line"
          defaultValue={defaultValue}/>
        <div style={{display:'block'}} className={validate === 'is-empty'? ("invalid-feedback"):("hidden")}>
          Select a valid product line from the dropdown list.
        </div>
    </FormGroup>
  );
  }
}


SKUsFormPLineSelection.propTypes = {
  getPLines: PropTypes.func.isRequired,
  plines: PropTypes.object.isRequired,
  onProductLineChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.object,
  validate: PropTypes.string
};

const mapStateToProps = state => ({
  plines: state.plines
});
export default connect(mapStateToProps, {getPLines})(SKUsFormPLineSelection);
