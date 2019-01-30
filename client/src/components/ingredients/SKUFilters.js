import React from 'react';
import {
  Badge, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, CustomInput, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSKUs } from '../../actions/skuActions';
import { sortIngs, filterBySKUs } from '../../actions/ingActions';

class SKUFilters extends React.Component {
  state={
    modal: false,
    sku_filters:{},
    selected_skus:{}
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    this.props.getSKUs();
  }

  onChange = (e, _id, name) =>{
    if(e.target.checked){
      const newSelected = this.state.selected_skus;
      newSelected[_id] = name;
      this.setState({
        selected_skus: newSelected
      });
    }
    else{
      delete this.state.selected_skus[_id];
    }
  }

  onAddFilters = () => {
    const newFilters = this.state.selected_skus;
    this.setState({
      sku_filters: newFilters
    });
    this.props.filterBySKUs(Object.keys(this.state.selected_skus));
    this.props.sortIngs(this.props.ing.sortby, this.props.ing.sortdir, this.props.ing.obj);
    this.toggle();
  };

  onRemoveFilter = e => {
    delete this.state.sku_filters[e.target.id];
    this.props.filterBySKUs(Object.keys(this.state.sku_filters));
    this.props.sortIngs(this.props.ing.sortby, this.props.ing.sortdir, this.props.ing.obj);
  };

  render() {
    const ids = this.state.sku_filters;
    return (
      <div>SKU Filters:  {'  '}
      <Badge style={{'marginLeft': '2px', 'marginRight': '2px'}} color="light"
        className={Object.keys(this.state.sku_filters).length !== 0? "hidden": ""}>
        <FontAwesomeIcon icon = "times"/>
        {' '}None
        </Badge>
        {Object.entries(ids).map(([key,value]) =>(
          <Badge id={key} style={{'marginLeft': '2px', 'marginRight': '2px'}} href="#" color="light"
            key={key} onClick={(e) => {this.onRemoveFilter(e)}}>
            <FontAwesomeIcon icon = "times"/> {' '}
            {value}
            </Badge>
        ))}
      <Badge style={{'marginLeft': '2px', 'marginRight': '2px'}} href="#" onClick={this.toggle} color="success">+ Add Filter</Badge>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>Select SKU Filters to Add</ModalHeader>
        <ModalBody style={{'textAlign': 'center'}}>
         <Form>
            <FormGroup>
              {this.props.skus.skus.map(({_id, name}) => (
                <CustomInput key={_id} type="checkbox" id={_id} label={name}
                defaultChecked={{_id} in this.state.sku_filters}
                onChange={(e) => {this.onChange(e, _id, name)}}inline/>
              ))}
            </FormGroup>
          </Form>

        </ModalBody>
        <ModalFooter>  <Button color="dark" onClick={this.onAddFilters} block>
                Add Selected SKU Filters
              </Button></ModalFooter>
      </Modal>
      </div>
    );
  }
}

SKUFilters.propTypes = {
  skus: PropTypes.object.isRequired,
  ing: PropTypes.object.isRequired,
  getSKUs: PropTypes.func.isRequired,
  sortIngs: PropTypes.func.isRequired,
  filterBySKUs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus,
  ing: state.ing
});
export default connect(mapStateToProps, {getSKUs, sortIngs, filterBySKUs})(SKUFilters);
