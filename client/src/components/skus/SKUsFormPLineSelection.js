import React from 'react';
import {
  Form, FormGroup, Input, Label
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPLines } from '../../actions/plineActions';

class SKUsFormPLineSelection extends React.Component {

  componentDidMount() {
    this.props.getPLines();
  }

  onChange = (e) => {
    const plines = this.props.plines.plines;
    const newPLine = plines.filter( pline => pline._id == e.target.value);
    this.props.onProductLineChange(newPLine);
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
          defaultValue={this.props.defaultValue == null ? '': this.props.defaultValue._id}>
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
  defaultValue: PropTypes.object
};

const mapStateToProps = state => ({
  plines: state.plines
});
export default connect(mapStateToProps, {getPLines})(SKUsFormPLineSelection);
