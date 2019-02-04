import React from 'react';
import {
  FormGroup, Input, Label
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPLines } from '../../actions/plineActions';

class SKUsFormPLineSelection extends React.Component {

  componentDidMount() {
    this.props.getPLines(1, -1);
  }

  onChange = (e) => {
    this.props.onProductLineChange(e.target.value);
  }

  render() {
    return(<FormGroup>
      <Label for="product_line">Product Line</Label>
        <Input
          type="select"
          name="product_line"
          id="product_line"
          placeholder="Select the Product Line"
          onChange={this.onChange.bind(this)}
          defaultValue={this.props.defaultValue}>
          <option>Select</option>
          {this.props.plines.plines.map(({_id, name }) => (
          <option key={_id} value={_id} name={name}>{name}</option>
        ))}
        </Input>
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
