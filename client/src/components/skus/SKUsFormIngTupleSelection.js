import React from 'react';
import {
FormGroup, Input, Label, Row, Col, Button, FormFeedback
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getIngs, sortIngs } from '../../actions/ingActions';

class SKUsFormIngTupleSelection extends React.Component {
  state={
    ing_tuples: [],
    validate: []
  };

  componentDidMount() {
    this.props.sortIngs('name', 'asc', 1, -1, {});
    var tmpArray = [];
    var tmpVal = [];
    if(this.props.defaultValue){
      this.props.defaultValue.forEach(function (inglistitem) {
        if(inglistitem._id){
          tmpArray = [...tmpArray, {_id: inglistitem._id._id, quantity: inglistitem.quantity}]
          tmpVal = [...tmpVal, {ing:'', quantity: ''}];
        }
      });
      this.setState({
        ing_tuples: tmpArray,
        validate: tmpVal
      });
    }
  }

  allValid = (validState=this.state.validate) => {
    console.log(validState);
    var isValid = true;
    for(var i = 0; i < validState.length; i++){
      if(validState[i].ing !== 'has-success' ||
       validState[i].quantity !== 'has-success'){
         isValid = false;
       }
    }
    return isValid;
  }

  onChangeIngredient = (index, e) => {
    const newIngTuples = this.state.ing_tuples;
    newIngTuples[index]._id = e.target.value;
    var newVal = this.state.validate;
    if(this.state.validate[index].quantity.length < 1) {
      newVal[index].quantity = 'not-valid';
    }
    if(e.target.value.length > 0){
      newVal[index].ing = 'has-success';
      this.setState({
        ing_tuples: newIngTuples,
        validate: newVal
      });
    }
    else{
      newVal[index].ing = 'not-selected';
    }
    this.setState({
      validate: newVal
    });
    this.props.onIngListChange(this.state.ing_tuples, this.allValid());
    }


  onChangeQuantity = (index, e) => {
    const numRex = /^(?!0\d)\d*(\.\d+)?$/mg
    const newIngTuples = this.state.ing_tuples;
    newIngTuples[index].quantity = e.target.value;
    var newVal = this.state.validate;
    if(this.state.validate[index].ing === ''){
      newVal[index].ing = 'not-selected';
    }
    if (numRex.test(e.target.value) && e.target.value.length > 0) {
      newVal[index].quantity = 'has-success';
      this.setState({
        ing_tuples: newIngTuples,
        validate: newVal
      });
    }
    else{
      newVal[index].quantity = 'not-valid';
    }
    this.setState({
      validate: newVal
    });
    this.props.onIngListChange(this.state.ing_tuples, this.allValid());
  }

  addIngTuple = () => {
    if(this.state.ing_tuples.length > 0) {
      this.setState({
        ing_tuples: [...this.state.ing_tuples, {_id:'', quantity:''}],
        validate: [...this.state.validate, {ing:'', quantity:''}]
      });
    }
    else {
      this.setState({
        ing_tuples: [{_id:'', quantity:''}],
        validate: [{ing:'', quantity:''}]
      });
    }
  }

  onDelEntry = (index) => {
    const reduced_tuples = this.state.ing_tuples.filter((_,i)=> i !== index);
    const reduced_val = this.state.validate.filter((_,i)=> i !== index);
    this.setState({
      ing_tuples: reduced_tuples,
      validate: reduced_val
    });
    this.props.onIngListChange(reduced_tuples, this.allValid(reduced_val));
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
                valid={this.state.validate[index].ing === 'has-success'}
                invalid={this.state.validate[index].ing === 'not-selected'}
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
              <FormFeedback>
                Please select a valid ingredient from the dropdown.
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Input
                valid={this.state.validate[index].quantity === 'has-success'}
                invalid={this.state.validate[index].quantity === 'not-valid'}
                type="text"
                name="ingredient_quantity"
                id="ingredient_quantity"
                placeholder="Quantity"
                onChange={this.onChangeQuantity.bind(this, index)}
                defaultValue={quantity}>

              </Input>
              <FormFeedback>
                Please enter a valid quantity.
              </FormFeedback>
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
  sortIngs: PropTypes.func.isRequired,
  ing: PropTypes.object.isRequired,
  onIngListChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.array
};

const mapStateToProps = state => ({
  ing: state.ing
});
export default connect(mapStateToProps, {getIngs, sortIngs})(SKUsFormIngTupleSelection);
