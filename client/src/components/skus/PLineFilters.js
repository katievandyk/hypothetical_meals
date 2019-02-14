import React from 'react';
import {
  Badge, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, CustomInput, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPLines } from '../../actions/plineActions';
import { sortSKUs, filterByPLines} from '../../actions/skuActions';

class PLineFilters extends React.Component {
  state={
    modal: false,
    pline_filters:{},
    selected_plines:{}
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  componentDidMount() {
    this.props.getPLines(1, -1);
  }

  onChange = (e, _id, name) =>{
    if(e.target.checked){
      const newSelected = this.state.selected_plines;
      newSelected[_id] = name;
      this.setState({
        selected_plines: newSelected
      });
    }
    else{
      delete this.state.selected_plines[_id];
    }
  }

  onAddFilters = () => {
    const newFilters = this.state.selected_plines;
    this.setState({
      pline_filters: newFilters
    });
    this.props.filterByPLines(Object.keys(this.state.selected_plines));
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir, 1, this.props.skus.pagelimit, this.props.skus.obj);
    this.toggle();
  };

  onRemoveFilter = e => {
    delete this.state.pline_filters[e.target.id];
    this.props.filterByPLines(Object.keys(this.state.pline_filters));
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir, 1, this.props.skus.pagelimit, this.props.skus.obj);
  };

  onXRemoveFilter = (e, id) => {
    delete this.state.pline_filters[id];
    this.props.filterByPLines(Object.keys(this.state.pline_filters));
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir, 1, this.props.skus.pagelimit, this.props.skus.obj);
  };

  render() {
    const ids = this.state.pline_filters;
    return (
      <div>Product Line Filters:  {'  '}
      <Badge style={{'marginLeft': '2px', 'marginRight': '2px'}} color="light"
        className={Object.keys(this.state.pline_filters).length !== 0? "hidden": ""}>
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
        <ModalHeader toggle={this.toggle}>Select Product Line Filters to Add</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              {this.props.plines.plines.map(({_id, name}) => (
                <CustomInput key={_id} type="checkbox" id={_id} label={name}
                defaultChecked={{_id} in this.state.pline_filters}
                onChange={(e) => {this.onChange(e, _id, name)}}inline/>
              ))}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>  <Button color="dark" onClick={this.onAddFilters} block>
                Add Selected Product Line Filters
              </Button></ModalFooter>
      </Modal>
      </div>
    );
  }
}

PLineFilters.propTypes = {
  skus: PropTypes.object.isRequired,
  plines: PropTypes.object.isRequired,
  getPLines: PropTypes.func.isRequired,
  sortSKUs: PropTypes.func.isRequired,
  filterByPLines: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus,
  plines: state.plines
});
export default connect(mapStateToProps, {getPLines, sortSKUs, filterByPLines})(PLineFilters);
