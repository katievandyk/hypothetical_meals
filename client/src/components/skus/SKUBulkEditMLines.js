import React from 'react';
import {
  Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
  Popover, PopoverHeader, PopoverBody,
  Form, FormGroup, CustomInput
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {getSKUsforBulkEdit, getMLineMappings, bulkEditSKULines } from '../../actions/skuActions';

class SKUBulkEditMLines extends React.Component {

  state = {
    sku_select_modal: false,
    mline_select_modal: false,
    popOverOpen: false,
    selected_skus:[],
    selected_mlines:[],
    not_selected_mlines:[],
    showAllSKUs: false
  }

  sku_select_toggle = () => {
    this.setState({
      sku_select_modal: !this.state.sku_select_modal
    });
  }

  mline_select_toggle = () => {
    this.setState({
      mline_select_modal: !this.state.mline_select_modal
    });
  }

  popover_toggle = () => {
    this.setState({
      popOverOpen: !this.state.popOverOpen
    });
  }

  onBulkEditClick = () => {
    this.props.getSKUsforBulkEdit(this.props.skus.obj);
    this.sku_select_toggle();
  }

  showAll = () => {
    this.setState({
      showAllSKUs: !this.state.showAllSKUs
    });
  }

  onChange = (e, sku) =>{
    var new_selected_skus = [];
    if(this.state.selected_skus.length > 0){
      new_selected_skus = this.state.selected_skus;
    }
    else {
      new_selected_skus = this.props.skus.bulkedit_skus;
    }
    if(e.target.checked){
      new_selected_skus = [...new_selected_skus, sku];
    }
    else{
      new_selected_skus = new_selected_skus.filter(({_id}) => _id !== sku._id);
    }
    this.setState({
      selected_skus: new_selected_skus
    });
  }

  onChangeMLine = (e, mline) => {
    var new_selected_mlines = [];
    var new_not_selected_mlines =[];
    if(this.state.selected_mlines.length > 0){
      new_selected_mlines = this.state.selected_mlines;
    }
    else {
      const all = this.props.skus.bulkedit_mlines.All;
      new_selected_mlines = all?(all):([]);
    }
    if(this.state.not_selected_mlines.length > 0){
      new_not_selected_mlines = this.state.not_selected_mlines;
    }
    else {
      if(this.props.skus.bulkedit_mlines.None){
        const none_mlines = this.props.skus.bulkedit_mlines.None;
        new_not_selected_mlines = new_not_selected_mlines.concat(none_mlines);
      }
      if(this.props.skus.bulkedit_mlines.Some){
        const some_mlines = this.props.skus.bulkedit_mlines.Some;
        new_not_selected_mlines = new_not_selected_mlines.concat(some_mlines);
      }

    }
    if(e.target.checked){
      new_selected_mlines = new_selected_mlines.concat(mline);
      new_not_selected_mlines = new_not_selected_mlines.filter(({_id}) => _id !== mline._id);
    }
    else{
      new_not_selected_mlines = new_not_selected_mlines.concat(mline);
      new_selected_mlines = new_selected_mlines.filter(({_id}) => _id !== mline._id);
    }
    this.setState({
      selected_mlines: new_selected_mlines,
      not_selected_mlines: new_not_selected_mlines
    });
  }

  onMapClick = () => {
    var new_selected_skus = [];
    if(this.state.selected_skus.length > 0){
      new_selected_skus = this.state.selected_skus;
    }
    else {
      new_selected_skus = this.props.skus.bulkedit_skus;
    }
    this.setState({
      showAllSKUs: false,
      selected_skus: new_selected_skus
    })
    var skuObj = {skus:new_selected_skus};
    this.props.getMLineMappings(skuObj);
    this.sku_select_toggle();
    this.mline_select_toggle();
  }

  onBulkEditMapClick = () =>{
    var new_selected_mlines = [];
    var new_not_selected_mlines = [];
    if(this.state.selected_mlines.length > 0){
      new_selected_mlines = this.state.selected_mlines;
    }
    else {
      new_selected_mlines = this.props.skus.bulkedit_mlines.All?(this.props.skus.bulkedit_mlines.All):([]);
    }
    if(this.state.not_selected_mlines.length > 0){
      new_not_selected_mlines = this.state.not_selected_mlines;
    }
    else {
      if(this.props.skus.bulkedit_mlines.None){
        const none_mlines = this.props.skus.bulkedit_mlines.None;
        new_not_selected_mlines = new_not_selected_mlines.concat(none_mlines);
      }
      if(this.props.skus.bulkedit_mlines.Some){
        const some_mlines = this.props.skus.bulkedit_mlines.Some;
        new_not_selected_mlines = new_not_selected_mlines.concat(some_mlines);
      }
    }
    var newObj = {skus:this.state.selected_skus, none:new_not_selected_mlines, all: new_selected_mlines};
    this.props.bulkEditSKULines(newObj, this.props.skus.sortby, this.props.skus.sortdir,
       this.props.skus.page, this.props.skus.pagelimit, this.props.skus.obj);
    this.mline_select_toggle();
  }

  onCancelClick = () => {
    this.setState({
      sku_select_modal: false,
      mline_select_modal: false,
      selected_mlines: [],
      not_selected_mlines:[],
      selected_skus:[],
      showAllSKUs: false
    });
  }

  render(){
    var bulkedit_skus = this.props.skus.bulkedit_skus;
    var bulkedit_mlines = this.props.skus.bulkedit_mlines;
    return(
      <div style={{display:'inline-block'}}>
        <Button id="bulkedit_button" color="success" onClick={this.onBulkEditClick}>
        Bulk Edit SKUs' Mfg. Lines
        </Button>
        <Popover trigger="hover" placement="bottom" isOpen={this.state.popOverOpen} target="bulkedit_button" toggle={this.popover_toggle}>
          <PopoverHeader>SKU Selection for Bulk Edit </PopoverHeader>
          <PopoverBody>
          Make sure to use the Ingredient Filters, Product Line
          Filters, and Keyword Search to specify which group of SKUs you want to edit.
          Once you've filtered the list, you can manually deselect the SKUs
          you don't want to bulk edit by clicking this button.
          </PopoverBody>
        </Popover>
        <Modal isOpen={this.state.sku_select_modal} toggle={this.sku_select_toggle}>
          <ModalHeader toggle={this.sku_select_toggle}>
            Select SKUs for Bulk Edit
          </ModalHeader>
          <ModalBody>
            <div>
              <b>
                Number of Selected SKUs: {' '}
                {this.state.selected_skus.length > 0 ?
                 (this.state.selected_skus.length):
                 (this.props.skus.bulkedit_skus.length)}
              </b>
              <Button onClick={this.showAll} color="link" size="sm">
                {this.state.showAllSKUs ? ('(Hide All)'):('(Edit Selection/View All)')}
              </Button>
            </div>
            <div>
            {this.state.showAllSKUs &&
              <Form>
               <FormGroup>
                 {bulkedit_skus.map((sku) => (
                   <CustomInput key={sku._id} type="checkbox" id={sku._id} label={sku.name+": " + sku.unit_size + " * " + sku.count_per_case  + " (SKU#: " + sku.number +")"}
                   defaultChecked={true}
                   onChange={(e) => {this.onChange(e, sku)}}/>
                 ))}
               </FormGroup>
             </Form>}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.onCancelClick}>
            Cancel
            </Button>
            <Button color="success" onClick={this.onMapClick}>
            Map Selected SKUs to Mfg. Lines
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.mline_select_modal} toggle={this.mline_select_toggle}>
          <ModalHeader toggle={this.mline_select_toggle}>
            Select Manufacturing Lines for SKUs
          </ModalHeader>
          <ModalBody>
          <div style={{paddingBottom:'1.5em'}}>
            <b>
              Number of Selected SKUs: {' '}
              {this.state.selected_skus.length}
            </b>
            <Button onClick={this.showAll} color="link" size="sm">
              {this.state.showAllSKUs ? ('(Hide All)'):('(View All)')}
            </Button>
            {this.state.showAllSKUs &&
              <div>
                 {this.state.selected_skus.map((sku) => (
                   <div key={sku._id}>
                   {sku.name+": " + sku.unit_size + " * " + sku.count_per_case  + " (SKU#: " + sku.number +")"}
                   </div>
                 ))}
               </div>
             }
          </div>
          <div>
          <b>Manufacturing Lines</b>
          <div>
          Lines that are already selected currently map to ALL of the SKUs.
          Lines that have *'s next to their shortnames are currently mapped to SOME of the SKUs.
          Otherwise, they map to NONE of the selected SKUs.
          </div>
          <div>
            <Form>
             <FormGroup>
               {bulkedit_mlines.All && bulkedit_mlines.All.map((mline) => (
                 <CustomInput key={mline._id} type="checkbox" id={mline._id} label={mline.shortname}
                 defaultChecked={true}
                 onChange={(e) => {this.onChangeMLine(e, mline)}}/>
               ))}
               {bulkedit_mlines.Some && bulkedit_mlines.Some.map((mline) => (
                 <CustomInput key={mline._id} type="checkbox" id={mline._id} label={mline.shortname + "*"}
                 defaultChecked={false} indeterminate="true"
                 onChange={(e) => {this.onChangeMLine(e, mline)}}/>
               ))}
               {bulkedit_mlines.None && bulkedit_mlines.None.map((mline) => (
                 <CustomInput key={mline._id} type="checkbox" id={mline._id} label={mline.shortname}
                 defaultChecked={false}
                 onChange={(e) => {this.onChangeMLine(e, mline)}}/>
               ))}
             </FormGroup>
           </Form>
          </div>
          </div>
          </ModalBody>
          <ModalFooter>
          <Button onClick={this.onCancelClick}>
          Cancel
          </Button>
          <Button color="success" onClick={this.onBulkEditMapClick}>
          Map Selected Mfg. Lines to Selected SKUs
          </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

SKUBulkEditMLines.propTypes = {
  getSKUsforBulkEdit: PropTypes.func.isRequired,
  getMLineMappings: PropTypes.func.isRequired,
  bulkEditSKULines: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired,
  lines: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus,
  lines: state.lines
});
export default connect(mapStateToProps, {getSKUsforBulkEdit, getMLineMappings, bulkEditSKULines})(SKUBulkEditMLines);
