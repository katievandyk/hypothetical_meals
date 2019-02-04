import React from 'react';
import {
  Badge, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, CustomInput, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSKUsByPLine } from '../../actions/skuActions';
import { getPLines } from '../../actions/plineActions';

class GoalsProductLineFilter extends React.Component {
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
    this.props.getPLines();
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
    this.props.getSKUsByPLine(Object.keys(this.state.selected_plines));
    this.toggle();
  };

  onRemoveFilter = e => {
    delete this.state.pline_filters[e.target.id];
    this.props.getSKUsByPLine(Object.keys(this.state.pline_filters));
  };

  onXRemoveFilter = (e, id) => {
    delete this.state.pline_filters[id];
    this.props.getSKUsByPLine(Object.keys(this.state.pline_filters));
  };

  render() {
    var plines = [];
    if(this.props.plines.plines.length > 0){
      plines = this.props.plines.plines;
    }
    const ids = this.state.pline_filters;
    return (
      <div>Product Line Filters:  {'  '}
      <Badge style={{'marginLeft': '2px', 'marginRight': '2px'}} color="light"
        className={Object.keys(this.state.pline_filters).length !== 0? "hidden": ""}>
        <FontAwesomeIcon icon = "times"/>
        {' '}None
        </Badge>
        {Object.entries(ids).map(([key,value]) =>(
          <Badge id={key} href="#" style={{'marginLeft': '2px', 'marginRight': '2px'}} color="light"
            key={key} onClick={(e) => {this.onRemoveFilter(e)}}>
            <FontAwesomeIcon href="#" onClick={(e) => {this.onXRemoveFilter(e, key)}} icon = "times"/>{' '}
            {value}
            </Badge>
        ))}
      <Badge style={{'marginLeft': '2px', 'marginRight': '2px'}} href="#" onClick={this.toggle} color="success">+ Add Filter</Badge>
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>Select Filters to Add</ModalHeader>
        <ModalBody style={{'textAlign': 'center'}}>
         <Form>
            <FormGroup>
              {plines.map(({_id, name}) => (
                <CustomInput key={_id} type="checkbox" id={_id} label={name}
                defaultChecked={{_id} in this.state.pline_filters}
                onChange={(e) => {this.onChange(e, _id, name)}}inline/>
              ))}
            </FormGroup>
          </Form>

        </ModalBody>
        <ModalFooter>  <Button color="dark" onClick={this.onAddFilters} block>
                Add Selected Filters
              </Button></ModalFooter>
      </Modal>
      </div>
    );
  }
}

GoalsProductLineFilter.propTypes = {
  plines: PropTypes.object.isRequired,
  skus: PropTypes.object.isRequired,
  getPLines: PropTypes.func.isRequired,
  getSKUsByPLine: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  plines: state.plines,
  skus: state.skus
});

export default connect(mapStateToProps, {getSKUsByPLine, getPLines})(GoalsProductLineFilter);
