import React from 'react';
import {
  Badge, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, CustomInput, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getIngs, sortIngs } from '../../actions/ingActions';
import { sortFormulas, filterByIngs} from '../../actions/formulaActions';

class IngFilters extends React.Component {
  state={
    modal: false,
    ing_filters:{},
    selected_ings:{}
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    this.props.sortIngs('name', 'asc', 1, -1, {});
  }

  onChange = (e, _id, name) =>{
    if(e.target.checked){
      const newSelected = this.state.selected_ings;
      newSelected[_id] = name;
      this.setState({
        selected_ings: newSelected
      });
    }
    else{
      delete this.state.selected_ings[_id];
    }
  }

  onAddFilters = () => {
    const newFilters = this.state.selected_ings;
    this.setState({
      ing_filters: newFilters
    });
    this.props.filterByIngs(Object.keys(this.state.selected_ings));
    this.props.sortFormulas(this.props.formulas.sortby, this.props.formulas.sortdir, this.props.formulas.page, this.props.formulas.pagelimit, this.props.formulas.obj);
    this.toggle();
  };

  onRemoveFilter = e => {
    delete this.state.ing_filters[e.target.id];
    this.props.filterByIngs(Object.keys(this.state.ing_filters));
    this.props.sortFormulas(this.props.formulas.sortby, this.props.formulas.sortdir, this.props.formulas.page, this.props.formulas.pagelimit, this.props.formulas.obj);
  };
  onXRemoveFilter = (e,id) => {
    delete this.state.ing_filters[id];
    this.props.filterByIngs(Object.keys(this.state.ing_filters));
    this.props.sortFormulas(this.props.formulas.sortby, this.props.formulas.sortdir, this.props.formulas.page, this.props.formulas.pagelimit, this.props.formulas.obj);
  };

  render() {
    const ids = this.state.ing_filters;
    return (
      <div>Ingredient Filters:  {'  '}
      <Badge style={{'marginLeft': '2px', 'marginRight': '2px'}} color="light"
        className={Object.keys(this.state.ing_filters).length !== 0? "hidden": ""}>
        <FontAwesomeIcon icon = "times"/>
        {' '}None
        </Badge>
        {Object.entries(ids).map(([key,value]) =>(
          <Badge id={key} style={{'marginLeft': '2px', 'marginRight': '2px'}} href="#" color="light"
            key={key} onClick={(e) => {this.onRemoveFilter(e)}}>
            <FontAwesomeIcon href="#" onClick={(e) => {this.onXRemoveFilter(e, key)}} icon = "times"/> {' '}
            {value}
            </Badge>
        ))}
      <Badge style={{'marginLeft': '2px', 'marginRight': '2px'}}
        href="#" onClick={this.toggle} color="success">
        + Add Filter</Badge>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>Select Ingredient Filters to Add</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              {this.props.ing.ings.map(({_id, name}) => (
                <CustomInput key={_id} type="checkbox" id={_id} label={name}
                defaultChecked={{_id} in this.state.ing_filters}
                onChange={(e) => {this.onChange(e, _id, name)}}inline/>
              ))}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>  <Button color="dark" onClick={this.onAddFilters} block>
                Add Selected Ingredient Filters
              </Button></ModalFooter>
      </Modal>
      </div>
    );
  }
}

IngFilters.propTypes = {
  formulas: PropTypes.object.isRequired,
  ing: PropTypes.object.isRequired,
  getIngs: PropTypes.func.isRequired,
  sortIngs: PropTypes.func.isRequired,
  sortFormulas: PropTypes.func.isRequired,
  filterByIngs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  formulas: state.formulas,
  ing: state.ing
});
export default connect(mapStateToProps, {getIngs, sortIngs, sortFormulas, filterByIngs})(IngFilters);
