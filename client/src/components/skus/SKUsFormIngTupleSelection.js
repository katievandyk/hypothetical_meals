import React from 'react';
import {
FormGroup, Input, Label, Row, Col, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getIngs } from '../../actions/ingActions';

class SKUsFormIngTupleSelection extends React.Component {
  state={
    ing_tuples: []
  };

  componentDidMount() {
    this.props.getIngs();
    var tmpArray = [];
    if(this.props.defaultValue){
      this.props.defaultValue.forEach(function (inglistitem) {
        tmpArray = [...tmpArray, {_id: inglistitem._id._id, quantity: inglistitem.quantity}]
      });
      this.setState({
        ing_tuples: tmpArray
      });
    }
  }

  onChangeIngredient = (index, e) => {
    const newIngTuples = this.state.ing_tuples;
    newIngTuples[index]._id = e.target.value;
    this.setState({
      ing_tuples: newIngTuples
    });
    this.props.onIngListChange(this.state.ing_tuples);
    }


  onChangeQuantity = (index, e) => {
    const newIngTuples = this.state.ing_tuples;
    newIngTuples[index].quantity = e.target.value;
    this.setState({
      ing_tuples: newIngTuples
    });
    this.props.onIngListChange(this.state.ing_tuples);
  }

  addIngTuple = () => {
    if(this.state.ing_tuples.length > 0) {
      this.setState({
        ing_tuples: [...this.state.ing_tuples, {_id:'', quantity:''}]
      });
    }
    else {
      this.setState({
        ing_tuples: [{_id:'', quantity:''}]
      });
    }
  }

  onDelEntry = (index) => {
    const reduced_tuples = this.state.ing_tuples.filter((_,i)=> i !== index);
    this.setState({
      ing_tuples: reduced_tuples
    });
    this.props.onIngListChange(reduced_tuples);
  }

  render() {
    const ing_tuples = this.state.ing_tuples;
    return(
      <div>
        <Row>
          <Col>
            <Label>Ingredient Tuples (Ingredient, Quantity)</Label>
          </Col>
        </Row>
        {ing_tuples.map(({_id, quantity }, index) => (
        <Row key={index}>
          <Col md={6}>
            <FormGroup>
              <Input
                type="select"
                name="ingredient_name"
                id="ingredient_name"
                placeholder="Select the Ingredient"
                onChange={this.onChangeIngredient.bind(this, index)}
                defaultValue={_id}>
                <option value=''>Select Ingredient</option>
                {this.props.ing.ings.map(({_id, name }) => (
                <option key={_id} value={_id} name={name}>{name}</option>
              ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Input
                type="text"
                name="ingredient_quantity"
                id="ingredient_quantity"
                placeholder="Quantity"
                onChange={this.onChangeQuantity.bind(this, index)}
                defaultValue={quantity}>

              </Input>
            </FormGroup>
          </Col >
          <Col md={2}>
            <Button size="sm" color="link"
              id={_id._id}
              onClick={this.onDelEntry.bind(this, index)}
              style={{'color':'black'}}>
              <FontAwesomeIcon style={{verticalAlign:'bottom'}} icon = "times"/>
            </Button>
          </Col>
        </Row>
        ))}
        <Row>
          <Col style={{textAlign: 'center'}}>
            <Button size="sm" onClick={this.addIngTuple}>
              Add Another Ingredient Tuple
            </Button>
          </Col>
        </Row>
      </div>
  );
  }
}


SKUsFormIngTupleSelection.propTypes = {
  getIngs: PropTypes.func.isRequired,
  ing: PropTypes.object.isRequired,
  onIngListChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.array
};

const mapStateToProps = state => ({
  ing: state.ing
});
export default connect(mapStateToProps, {getIngs})(SKUsFormIngTupleSelection);
