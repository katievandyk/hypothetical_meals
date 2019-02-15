import React from 'react';
import {
  FormGroup, FormFeedback, Input, Label
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPLines } from '../../actions/plineActions';

class SKUsFormPLineSelection extends React.Component {
  state = {
    validate: ''
  }
  componentDidMount() {
    this.props.getPLines(1, -1);
  }

  onChange = (e) => {
    var valString = 'has-success';
    var isValid = true;
    if(e.target.value === 'select'){
      valString = 'on-select';
      isValid = false;
    }
    this.setState({
      validate: valString
    });
    this.props.onProductLineChange(e.target.value, isValid);
  }

  render() {
    return(<FormGroup>
      <Label for="product_line">Product Line</Label>
        <Input
          valid={this.state.validate === 'has-success'}
          invalid={this.state.validate === 'on-select'}
          type="select"
          name="product_line"
          id="product_line"
          placeholder="Select the Product Line"
          onChange={this.onChange.bind(this)}
          defaultValue={this.props.defaultValue}>
          <option key='select' value='select'>Select</option>
          {this.props.plines.plines.map(({_id, name }) => (
          <option key={_id} value={_id} name={name}>{name}</option>
        ))}
        </Input>
        <FormFeedback>
          Select a valid product line from the dropdown list.
        </FormFeedback>
    </FormGroup>
  );
  }
}


SKUsFormPLineSelection.propTypes = {
  getPLines: PropTypes.func.isRequired,
  plines: PropTypes.object.isRequired,
  onProductLineChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string
};

const mapStateToProps = state => ({
  plines: state.plines
});
export default connect(mapStateToProps, {getPLines})(SKUsFormPLineSelection);
