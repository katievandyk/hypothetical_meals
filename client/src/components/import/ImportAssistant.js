import React, { Component } from 'react';

import {
  Modal, ModalHeader, ModalBody, ModalFooter, Table, Button,
  CustomInput, PopoverBody, Popover, PopoverHeader
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { uploadCheck, importOverwrites } from '../../actions/importActions';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ImportAssistant extends Component {
  state = {
    new_overWrite: [],
    results_modal: false,
    popupOW: false,
    popupIGNORE: false,
    popupSTORE: false
  }

  onChange = (e, i, obj) => {
    if(e.target.checked){
      this.setState({
        new_overWrite: [...this.state.new_overWrite, obj]
      });
    }
    else{ //target not checked, remove from new_overWrite obj
      const new_ow = this.state.new_overWrite.filter(function(entry){
        return !(entry === obj)
      });
      this.setState({
        new_overWrite: new_ow
      });

    }

  }

  popOWtoggle = () => {
    this.setState({
      popupOW: !this.state.popupOW
    });
  }

  popSTOREtoggle = () => {
    this.setState({
      popupSTORE: !this.state.popupSTORE
    });
  }
  popIGNOREtoggle = () => {
    this.setState({
      popupIGNORE: !this.state.popupIGNORE
    });
  }

  popOverOpen = type => {
    if(type ==='overwrite'){
      return this.state.popupOW;
    }
    else if(type === 'store'){
      return this.state.popupSTORE;
    }
    else if(type === 'ignore'){
      return this.state.popupIGNORE;
    }
  }
  submitImport = () => {
    const new_ow = this.state.new_overWrite;
    this.setState({
      new_overWrite: [],
      results_modal: true
    });
    const new_no_ow = this.props.import.check_res.Overwrite.filter(function(entry){
      return (new_ow.indexOf(entry) === -1)
    });
    const new_checkRes = this.props.import.check_res;
    new_checkRes.Overwrite = new_ow;
    new_checkRes.NoOverwrite = new_no_ow;
    var fileName = this.props.import.check_res.file_type;
    if(fileName === 'product_lines'){
      fileName = 'productlines';
    }
    this.props.importOverwrites(new_checkRes, fileName);
    this.props.toggle();
  }

  results_modal_toggle = () => {
    this.setState({
      results_modal: !this.state.results_modal
    })
  }

  onCancel = () => {
    this.setState({
      new_overWrite: []
    });
    this.props.toggle();
  }

  //new

  owSKUsMLines = (mlines) => {
    var mlineString = '';
    for(var i = 0; i < mlines.length; i++){
      if(mlines[i]._id){
        mlineString = mlineString + mlines[i]._id.shortname +',';
      }
    }
    var cleanedMLines = mlineString.substring(0, mlineString.length-1);
    return cleanedMLines;
  }

  displayOverwrite_check = (file_type, ow) => {
    if(ow && ow.length > 0){
      if(file_type === 'skus'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>Overwrite?</th>
                <th>SKU#</th>
                <th>Name</th>
                <th>Case UPC</th>
                <th>Unit UPC</th>
                <th>Unit size</th>
                <th>Count per case</th>
                <th>PL Name</th>
                <th>Formula#</th>
                <th>Formula factor</th>
                <th>ML shortnames</th>
                <th>Setup cost</th>
                <th>Run cost</th>
                <th>Comment</th>
              </tr>
            </thead>
              {ow.map((entry, i) => (
                <tbody key={i}>
                  <tr>
                    <td>
                      <CustomInput key={i} type="checkbox" id={i}
                        onChange={(e) => {this.onChange(e, i, entry)}}inline/>
                    </td>
                    <td>{entry['sku#']}</td>
                    <td>{entry['name']}</td>
                    <td>{entry['case upc']}</td>
                    <td>{entry['unit upc']}</td>
                    <td>{entry['unit size']}</td>
                    <td>{entry['count per case']}</td>
                    <td>{entry['pl name']}</td>
                    <td>{entry['formula#']}</td>
                    <td>{entry['formula factor']}</td>
                    <td>{entry['ml shortnames']}</td>
                    <td>{entry['mfg setup cost']}</td>
                    <td>{entry['mfg run cost']}</td>
                    <td>{entry['comment']}</td>
                  </tr>
                  <tr style={{backgroundColor:'#d3d3d3', fontStyle:'italic'}}>
                    <td>Current Entry</td>
                    <td>{entry.to_overwrite['number']}</td>
                    <td>{entry.to_overwrite['name']}</td>
                    <td>{entry.to_overwrite['case_number']}</td>
                    <td>{entry.to_overwrite['unit_number']}</td>
                    <td>{entry.to_overwrite['unit_size']}</td>
                    <td>{entry.to_overwrite['count_per_case']}</td>
                    <td>{entry.to_overwrite.product_line ? (entry.to_overwrite.product_line.name):('')}</td>
                    <td>{entry.to_overwrite.formula ? (entry.to_overwrite.formula.number):('')}</td>
                    <td>{entry.to_overwrite['formula_scale_factor']}</td>
                    <td>{this.owSKUsMLines(entry.to_overwrite.manufacturing_lines)}</td>
                    <td>{entry.to_overwrite['setup_cost']}</td>
                    <td>{entry.to_overwrite['run_cost']}</td>
                    <td>{entry.to_overwrite['comment']}</td>
                  </tr>
                </tbody>
              ))}

          </Table>
        );
      }
      else if(file_type === 'ingredients'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>Overwrite?</th>
                <th>Ingr#</th>
                <th>Name</th>
                <th>Vendor Info</th>
                <th>Size</th>
                <th>Cost</th>
                <th>Comment</th>
              </tr>
            </thead>
              {ow.map((entry, i) => (
                <tbody key={i}>
                  <tr>
                    <td>
                      <CustomInput key={i} type="checkbox" id={i}
                        onChange={(e) => {this.onChange(e, i, entry)}}inline/>
                    </td>
                    <td>{entry['ingr#']}</td>
                    <td>{entry['name']}</td>
                    <td>{entry['vendor info']}</td>
                    <td>{entry['size']}</td>
                    <td>{entry['cost']}</td>
                    <td>{entry['comment']}</td>
                  </tr>
                  <tr style={{backgroundColor:'#d3d3d3', fontStyle:'italic'}}>
                    <td>Current Entry</td>
                    <td>{entry.to_overwrite['number']}</td>
                    <td>{entry.to_overwrite['name']}</td>
                    <td>{entry.to_overwrite['vendor_info']}</td>
                    <td>{entry.to_overwrite['package_size']}</td>
                    <td>{entry.to_overwrite['cost_per_package']}</td>
                    <td>{entry.to_overwrite['comment']}</td>
                  </tr>
                </tbody>
              ))}

          </Table>
        );
      }
      else if(file_type === 'product_lines'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>Overwrite?</th>
                <th>Name</th>
              </tr>
            </thead>
              {ow.map((entry, i) => (
                <tbody key={i}>
                  <tr>
                    <td>
                      <CustomInput key={i} type="checkbox" id={i}
                        onChange={(e) => {this.onChange(e, i, entry)}}inline/>
                    </td>
                    <td>{entry['name']}</td>
                  </tr>
                  <tr style={{backgroundColor:'#d3d3d3', fontStyle:'italic'}}>
                    <td>Current Entry</td>
                    <td>{entry.to_overwrite['name']}</td>
                  </tr>
                </tbody>
              ))}

          </Table>
        );
      }
      else if(file_type === 'formulas'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>Overwrite?</th>
                <th>Formula#</th>
                <th>Name</th>
                <th>Ingr#</th>
                <th>Quantity</th>
                <th>Comment</th>
              </tr>
            </thead>
              {ow.map((entry, i) => (
                <tbody key={i}>
                  {entry.ingredients_list.map((ingItem, j) => (
                    <tr key={j}>
                      <td>
                        {(j === 0)?(<CustomInput key={i} type="checkbox" id={i}
                          onChange={(e) => {this.onChange(e, i, entry)}}inline/>):('')}
                      </td>
                      <td>{entry['number']}</td>
                      <td>{entry['name']}</td>
                      <td>{ingItem['number']}</td>
                      <td>{ingItem['quantity']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                  {entry.to_overwrite &&
                    entry.to_overwrite.ingredients_list.map((ingItem_ow, k) => (
                    <tr key={k} style={{backgroundColor:'#d3d3d3', fontStyle:'italic'}}>
                      <td>{(k===0)? ('Current Entry'):('')}</td>
                      <td>{entry.to_overwrite['number']}</td>
                      <td>{entry.to_overwrite['name']}</td>
                      <td>{ingItem_ow['_id'].number}</td>
                      <td>{ingItem_ow['quantity']}</td>
                      <td>{entry.to_overwrite['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              ))}

          </Table>
        );
      }
    }
    else{
      return('None');
    }
  }

  displayStore_check = (file_type, store) => {
    if(store && store.length > 0){
      if(file_type === 'skus'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>SKU#</th>
                <th>Name</th>
                <th>Case UPC</th>
                <th>Unit UPC</th>
                <th>Unit size</th>
                <th>Count per case</th>
                <th>PL Name</th>
                <th>Formula#</th>
                <th>Formula factor</th>
                <th>ML shortnames</th>
                <th>Setup cost</th>
                <th>Run cost</th>
                <th>Comment</th>
              </tr>
            </thead>
              <tbody>
              {store.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry['sku#']}</td>
                    <td>{entry['name']}</td>
                    <td>{entry['case upc']}</td>
                    <td>{entry['unit upc']}</td>
                    <td>{entry['unit size']}</td>
                    <td>{entry['count per case']}</td>
                    <td>{entry['pl name']}</td>
                    <td>{entry['formula#']}</td>
                    <td>{entry['formula factor']}</td>
                    <td>{entry['ml shortnames']}</td>
                    <td>{entry['mfg setup cost']}</td>
                    <td>{entry['mfg run cost']}</td>
                    <td>{entry['comment']}</td>
                  </tr>
              ))}
            </tbody>
          </Table>
        );
      }
      else if(file_type === 'ingredients'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>Ingr#</th>
                <th>Name</th>
                <th>Vendor Info</th>
                <th>Size</th>
                <th>Cost</th>
                <th>Comment</th>
              </tr>
            </thead>
              <tbody>
              {store.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry['ingr#']}</td>
                    <td>{entry['name']}</td>
                    <td>{entry['vendor info']}</td>
                    <td>{entry['size']}</td>
                    <td>{entry['cost']}</td>
                    <td>{entry['comment']}</td>
                  </tr>
              ))}
            </tbody>
          </Table>
        );
      }
      else if(file_type === 'product_lines'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
              <tbody>
              {store.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry['name']}</td>
                  </tr>
              ))}
            </tbody>
          </Table>
        );
      }
      else if(file_type === 'formulas'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>Formula#</th>
                <th>Name</th>
                <th>Ingr#</th>
                <th>Quantity</th>
                <th>Comment</th>
              </tr>
            </thead>
              {store.map((entry, i) => (
                <tbody key={i}>
                  {entry.ingredients_list.map((ingItem, k) => (
                    <tr key={k}>
                      <td>{entry['number']}</td>
                      <td>{entry['name']}</td>
                      <td>{ingItem['number']}</td>
                      <td>{ingItem['quantity']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
          </Table>
        );
      }
    }
    else{
      return('None');
    }
  }

  displayIgnore_check = (file_type, ignore) => {
    if(ignore && ignore.length > 0){
      if(file_type === 'skus'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>SKU#</th>
                <th>Name</th>
                <th>Case UPC</th>
                <th>Unit UPC</th>
                <th>Unit size</th>
                <th>Count per case</th>
                <th>PL Name</th>
                <th>Formula#</th>
                <th>Formula factor</th>
                <th>ML shortnames</th>
                <th>Setup cost</th>
                <th>Run cost</th>
                <th>Comment</th>
              </tr>
            </thead>
              <tbody>
              {ignore.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry['sku#']}</td>
                    <td>{entry['name']}</td>
                    <td>{entry['case upc']}</td>
                    <td>{entry['unit upc']}</td>
                    <td>{entry['unit size']}</td>
                    <td>{entry['count per case']}</td>
                    <td>{entry['pl name']}</td>
                    <td>{entry['formula#']}</td>
                    <td>{entry['formula factor']}</td>
                    <td>{entry['ml shortnames']}</td>
                    <td>{entry['mfg setup cost']}</td>
                    <td>{entry['mfg run cost']}</td>
                    <td>{entry['comment']}</td>
                  </tr>
              ))}
            </tbody>
          </Table>
        );
      }
      else if(file_type === 'ingredients'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>Ingr#</th>
                <th>Name</th>
                <th>Vendor Info</th>
                <th>Size</th>
                <th>Cost</th>
                <th>Comment</th>
              </tr>
            </thead>
              <tbody>
              {ignore.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry['ingr#']}</td>
                    <td>{entry['name']}</td>
                    <td>{entry['vendor info']}</td>
                    <td>{entry['size']}</td>
                    <td>{entry['cost']}</td>
                    <td>{entry['comment']}</td>
                  </tr>
              ))}
            </tbody>
          </Table>
        );
      }
      else if(file_type === 'product_lines'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
              <tbody>
              {ignore.map((entry, i) => (
                  <tr key={i}>
                    <td>{entry['name']}</td>
                  </tr>
              ))}
            </tbody>
          </Table>
        );
      }
      else if(file_type === 'formulas'){
        return(
          <Table responsive size="sm">
            <thead>
              <tr>
                <th>Formula#</th>
                <th>Name</th>
                <th>Ingr#</th>
                <th>Quantity</th>
                <th>Comment</th>
              </tr>
            </thead>
              {ignore.map((entry, i) => (
                <tbody key={i}>
                  {entry.ingredients_list.map((ingItem,j) => (
                    <tr key={j}>
                      <td>{entry['number']}</td>
                      <td>{entry['name']}</td>
                      <td>{ingItem['number']}</td>
                      <td>{ingItem['quantity']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              ))}
          </Table>
        );
      }
    }
    else{
      return('None');
    }
  }

  displayStore_res = (file_type, store) => {
    if(store && store.records && store.records.length > 0){
      if(file_type === 'skus'){
        return(
          <div>
            <h4>Store: {store.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>SKU#</th>
                    <th>Name</th>
                    <th>Case UPC</th>
                    <th>Unit UPC</th>
                    <th>Unit size</th>
                    <th>Count per case</th>
                    <th>PL Name</th>
                    <th>Formula#</th>
                    <th>Formula factor</th>
                    <th>ML shortnames</th>
                    <th>Setup cost</th>
                    <th>Run cost</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {store.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['sku#']}</td>
                      <td>{entry['name']}</td>
                      <td>{entry['case upc']}</td>
                      <td>{entry['unit upc']}</td>
                      <td>{entry['unit size']}</td>
                      <td>{entry['count per case']}</td>
                      <td>{entry['pl name']}</td>
                      <td>{entry['formula#']}</td>
                      <td>{entry['formula factor']}</td>
                      <td>{entry['ml shortnames']}</td>
                      <td>{entry['mfg setup cost']}</td>
                      <td>{entry['mfg run cost']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'ingredients'){
        return(
          <div>
            <h4>Store: {store.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Ingr#</th>
                    <th>Name</th>
                    <th>Vendor Info</th>
                    <th>Size</th>
                    <th>Cost</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {store.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['number']}</td>
                      <td>{entry['name']}</td>
                      <td>{entry['vendor_info']}</td>
                      <td>{entry['package_size']}</td>
                      <td>{entry['cost_per_package']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'product_lines'){
        return(
          <div>
            <h4>Store: {store.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {store.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['name']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'formulas'){
        return(
          <div>
            <h4>Store: {store.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Formula#</th>
                    <th>Name</th>
                    <th>Ingr#</th>
                    <th>Quantity</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                  {store.records.map((entry, i)=>(
                    <tbody key={i}>
                      {entry.ingredients_list.map((ingItem, j) => (
                        <tr key={j}>
                          <td>{entry['number']}</td>
                          <td>{entry['name']}</td>
                          <td>{ingItem["number"]}</td>
                          <td>{ingItem["quantity"]}</td>
                          <td>{entry['comment']}</td>
                        </tr>
                      ))}
                    </tbody>
                  ))}
              </Table>
          </div>
        );
      }
    }
    else{
      return(
        <h4>Store: 0 records</h4>
      );
    }
  }

  displayOverwrite_res = (file_type, ow) => {
    if(ow && ow.records && ow.records.length > 0){
      if(file_type === 'skus'){
        return(
          <div>
            <h4>Overwrite: {ow.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>SKU#</th>
                    <th>Name</th>
                    <th>Case UPC</th>
                    <th>Unit UPC</th>
                    <th>Unit size</th>
                    <th>Count per case</th>
                    <th>PL Name</th>
                    <th>Formula#</th>
                    <th>Formula factor</th>
                    <th>ML shortnames</th>
                    <th>Setup cost</th>
                    <th>Run cost</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {ow.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['sku#']}</td>
                      <td>{entry['name']}</td>
                      <td>{entry['case upc']}</td>
                      <td>{entry['unit upc']}</td>
                      <td>{entry['unit size']}</td>
                      <td>{entry['count per case']}</td>
                      <td>{entry['pl name']}</td>
                      <td>{entry['formula#']}</td>
                      <td>{entry['formula factor']}</td>
                      <td>{entry['ml shortnames']}</td>
                      <td>{entry['mfg setup cost']}</td>
                      <td>{entry['mfg run cost']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'ingredients'){
        return(
          <div>
            <h4>Overwrite: {ow.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Ingr#</th>
                    <th>Name</th>
                    <th>Vendor Info</th>
                    <th>Size</th>
                    <th>Cost</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {ow.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['number']}</td>
                      <td>{entry['name']}</td>
                      <td>{entry['vendor_info']}</td>
                      <td>{entry['package_size']}</td>
                      <td>{entry['cost_per_package']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'product_lines'){
        return(
          <div>
            <h4>Overwrite: {ow.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {ow.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['name']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'formulas'){
        return(
          <div>
            <h4>Overwrite: {ow.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Formula#</th>
                    <th>Name</th>
                    <th>Ingr#</th>
                    <th>Quantity</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                  {ow.records.map((entry, i)=>(
                    <tbody key={i}>
                      {entry.ingredients_list.map((ingItem, j) => (
                        <tr key={j}>
                          <td>{entry['number']}</td>
                          <td>{entry['name']}</td>
                          <td>{ingItem["number"]}</td>
                          <td>{ingItem["quantity"]}</td>
                          <td>{entry['comment']}</td>
                        </tr>
                      ))}
                    </tbody>
                  ))}
              </Table>
          </div>
        );
      }
    }
    else{
      return(
        <h4>Overwrite: 0 records</h4>
      );
    }
  }

  displayIgnore_res = (file_type, ignore) => {
    if(ignore && ignore.records && ignore.records.length > 0){
      if(file_type === 'skus'){
        return(
          <div>
            <h4>Ignore: {ignore.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>SKU#</th>
                    <th>Name</th>
                    <th>Case UPC</th>
                    <th>Unit UPC</th>
                    <th>Unit size</th>
                    <th>Count per case</th>
                    <th>PL Name</th>
                    <th>Formula#</th>
                    <th>Formula factor</th>
                    <th>ML shortnames</th>
                    <th>Setup cost</th>
                    <th>Run cost</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {ignore.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['sku#']}</td>
                      <td>{entry['name']}</td>
                      <td>{entry['case upc']}</td>
                      <td>{entry['unit upc']}</td>
                      <td>{entry['unit size']}</td>
                      <td>{entry['count per case']}</td>
                      <td>{entry['pl name']}</td>
                      <td>{entry['formula#']}</td>
                      <td>{entry['formula factor']}</td>
                      <td>{entry['ml shortnames']}</td>
                      <td>{entry['mfg setup cost']}</td>
                      <td>{entry['mfg run cost']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'ingredients'){
        return(
          <div>
            <h4>Ignore: {ignore.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Ingr#</th>
                    <th>Name</th>
                    <th>Vendor Info</th>
                    <th>Size</th>
                    <th>Cost</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {ignore.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['ingr#']}</td>
                      <td>{entry['name']}</td>
                      <td>{entry['vendor info']}</td>
                      <td>{entry['size']}</td>
                      <td>{entry['cost']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'product_lines'){
        return(
          <div>
            <h4>Ignore: {ignore.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {ignore.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['name']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'formulas'){
        return(
          <div>
            <h4>Ignore: {ignore.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Formula#</th>
                    <th>Name</th>
                    <th>Ingr#</th>
                    <th>Quantity</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                  {ignore.records.map((entry, i)=>(
                    <tbody key={i}>
                      {entry.ingredients_list.map((ingItem, j) => (
                        <tr key={j}>
                          <td>{entry['number']}</td>
                          <td>{entry['name']}</td>
                          <td>{ingItem["number"]}</td>
                          <td>{ingItem["quantity"]}</td>
                          <td>{entry['comment']}</td>
                        </tr>
                      ))}
                    </tbody>
                  ))}
              </Table>
          </div>
        );
      }
    }
    else{
      return(
        <h4>Ignore: 0 records</h4>
      );
    }
  }

  displayNoOverwrite_res = (file_type, no_ow) => {
    if(no_ow && no_ow.records && no_ow.records.length > 0){
      if(file_type === 'skus'){
        return(
          <div>
            <h4>Ignored Overwrites: {no_ow.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>SKU#</th>
                    <th>Name</th>
                    <th>Case UPC</th>
                    <th>Unit UPC</th>
                    <th>Unit size</th>
                    <th>Count per case</th>
                    <th>PL Name</th>
                    <th>Formula#</th>
                    <th>Formula factor</th>
                    <th>ML shortnames</th>
                    <th>Setup cost</th>
                    <th>Run cost</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {no_ow.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['sku#']}</td>
                      <td>{entry['name']}</td>
                      <td>{entry['case upc']}</td>
                      <td>{entry['unit upc']}</td>
                      <td>{entry['unit size']}</td>
                      <td>{entry['count per case']}</td>
                      <td>{entry['pl name']}</td>
                      <td>{entry['formula#']}</td>
                      <td>{entry['formula factor']}</td>
                      <td>{entry['ml shortnames']}</td>
                      <td>{entry['mfg setup cost']}</td>
                      <td>{entry['mfg run cost']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'ingredients'){
        return(
          <div>
            <h4>Ignored Overwrites: {no_ow.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Ingr#</th>
                    <th>Name</th>
                    <th>Vendor Info</th>
                    <th>Size</th>
                    <th>Cost</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {no_ow.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['ingr#']}</td>
                      <td>{entry['name']}</td>
                      <td>{entry['vendor info']}</td>
                      <td>{entry['size']}</td>
                      <td>{entry['cost']}</td>
                      <td>{entry['comment']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'product_lines'){
        return(
          <div>
            <h4>Ignored Overwrites: {no_ow.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {no_ow.records.map((entry, i)=>(
                    <tr key={i}>
                      <td>{entry['name']}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
          </div>
        );
      }
      else if(file_type === 'formulas'){
        return(
          <div>
            <h4>Ignored Overwrites: {no_ow.count} records</h4>
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Formula#</th>
                    <th>Name</th>
                    <th>Ingr#</th>
                    <th>Quantity</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                  {no_ow.records.map((entry, i)=>(
                    <tbody key={i}>
                      {entry.ingredients_list.map((ingItem, j) => (
                        <tr key={j}>
                          <td>{entry['number']}</td>
                          <td>{entry['name']}</td>
                          <td>{ingItem["number"]}</td>
                          <td>{ingItem["quantity"]}</td>
                          <td>{entry['comment']}</td>
                        </tr>
                      ))}
                    </tbody>
                  ))}
              </Table>
          </div>
        );
      }
    }
    else{
      return(
        <h4>Ignored Overwrites: 0 records</h4>
      );
    }
  }

  render(){
    var res = this.props.import.check_res;
    var file_type = '';
    if(Object.keys(res).length > 0){
      file_type = res.file_type;
    }

    const import_res = this.props.import.import_res;
    if(this.props.import.success && !this.props.import.loading){
      return (
        <div>
          <Modal size="xl" isOpen={this.props.modal && this.props.import.success} toggle={this.props.toggle}>
            <ModalHeader toggle={this.props.toggle}> Review and Submit Import </ModalHeader>
            <ModalBody>
              <div key="Overwrite" style={{paddingBottom:'2em'}}>
                <h4>Overwrite
                  <Button id="Overwrite" color="link" size="sm"type="button">
                    <FontAwesomeIcon icon="info-circle"/>
                  </Button>
                  <Popover placement="right" isOpen={this.state.popupOW} trigger="hover" target="Overwrite" id="Overwrite" toggle={this.popOWtoggle}>
                    <PopoverHeader>Overwrite</PopoverHeader>
                    <PopoverBody>These are entries from your import file that would overwrite existing entries
                    in the database if you import them. You can select whether or not you want to overwrite the
                    existing entry by checking the Overwrite? column. Below your imported entry is the current entry in grey.</PopoverBody>
                  </Popover>
                </h4>
                {this.displayOverwrite_check(file_type, res.Overwrite)}
              </div>
              <div key="Store" style={{paddingBottom:'2em'}}>
                <h4>Store
                  <Button id="Store" color="link" size="sm"type="button">
                    <FontAwesomeIcon icon="info-circle"/>
                  </Button>
                  <Popover placement="right" trigger="hover"
                    isOpen={this.state.popupSTORE}
                    target="Store" toggle={this.popSTOREtoggle}>
                    <PopoverHeader>Store</PopoverHeader>
                    <PopoverBody>
                      These are entries from your file that will be stored in the database if you submit the import.
                    </PopoverBody>
                  </Popover>
                </h4>
                {this.displayStore_check(file_type, res.Store)}
              </div>
              <div key="Ignore" style={{paddingBottom:'2em'}}>
                <h4>Ignore
                  <Button id="Ignore" color="link" size="sm"type="button">
                    <FontAwesomeIcon icon="info-circle"/>
                  </Button>
                  <Popover placement="right" trigger="hover"
                    isOpen={this.state.popupIGNORE}
                    target="Ignore" toggle={this.popIGNOREtoggle}>
                    <PopoverHeader>Store</PopoverHeader>
                    <PopoverBody>
                      These are entries from your file that are duplicates to ones
                      already existing in the database and will be ignored.
                    </PopoverBody>
                  </Popover>
                </h4>
                {this.displayIgnore_check(file_type, res.Ignore)}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.submitImport}>Submit Import Decisions</Button>
              <Button onClick={this.onCancel} color="danger">Cancel</Button>
            </ModalFooter>
          </Modal>
          <Modal size="xl" style={{color:'darkgreen'}} className="importSummary"
            isOpen={this.state.results_modal && this.props.import.success}
            toggle={this.results_modal_toggle}>
            <ModalHeader toggle={this.results_modal_toggle}>
              Successful Import Summary
            </ModalHeader>
            <ModalBody>
              <div>
                {this.displayStore_res(file_type, import_res.Store)}
                {this.displayOverwrite_res(file_type, import_res.Overwrite)}
                {this.displayIgnore_res(file_type, import_res.Ignore)}
                {this.displayNoOverwrite_res(file_type, import_res.NoOverwrite)}
              </div>
            </ModalBody>
          </Modal>
        </div>
      );
    }
    else{
      return(<div></div>);
    }
  }
}

ImportAssistant.propTypes = {
  uploadCheck: PropTypes.func.isRequired,
  importOverwrites: PropTypes.func.isRequired,
  import: PropTypes.object.isRequired,
  modal: PropTypes.bool.isRequired,
  toggle:PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  import: state.import
});

export default connect(mapStateToProps, {uploadCheck, importOverwrites})(ImportAssistant);
