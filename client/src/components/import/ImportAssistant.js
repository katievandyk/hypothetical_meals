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

  ow_oldEntry_helper = (oldEntry, file_headers, obj_headers) => {
    var new_ow_arr = [];
    var i;
    for (i = 0; i < file_headers.length; i++) {
      var newkv = ['', ''];
      newkv[0] = file_headers[i];
      if(newkv[0] === 'Product Line Name'){
        newkv[1] = oldEntry[obj_headers[i]].name;
      }
      else{
        newkv[1] = oldEntry[obj_headers[i]];
      }
      new_ow_arr = [...new_ow_arr, newkv];
    }
    return new_ow_arr;
  }

  asst_ow_helper = (obj, file_headers) => {
    var new_ow_arr = [];
    var i;
    for (i = 0; i < file_headers.length; i++) {
      var newkv = ['', ''];
      newkv[0] = file_headers[i];
      newkv[1] = obj[file_headers[i]];
      new_ow_arr = [...new_ow_arr, newkv];
    }
    return new_ow_arr;
  }

  old_formulas_helper = (obj, sku_num) => {
    var prevEntries = [];
    if(obj.length > 0){
      for(var i = 0; i < obj.length; i++){
        if(obj[i]._id){
          var newObj = {"SKU#": sku_num, "Ing#":obj[i]._id.number, "Quantity": obj[i].quantity}
          prevEntries = [...prevEntries, newObj];
        }
      }
    }
    //return newArr;
    return(
      prevEntries.length > 0 ? (
        prevEntries.map((value, i) => (
      <tr key= {i} style={{backgroundColor:'#d3d3d3', fontStyle:'italic'}}>
        <td>Current Entry</td>
        {Object.entries(value).map(([key,val])=> (
          <td key={key}>{val}</td>
        ))}
      </tr>
      ))
      ):
       (<tr style={{backgroundColor:'#d3d3d3', fontStyle:'italic'}}>
       <td>Current Entry</td><td colSpan="3">No Previous Formula Entries Found</td>
     </tr>)
      );
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
                    <td>{entry['cost']}</td>
                    <td>{entry['comment']}</td>
                  </tr>
                  <tr style={{backgroundColor:'#d3d3d3', fontStyle:'italic'}}>
                    <td>Current Entry</td>
                    <td>{entry.to_overwrite['number']}</td>
                    <td>{entry.to_overwrite['name']}</td>
                    <td>{entry.to_overwrite['vendor_info']}</td>
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
                      <td>{ingItem_ow['quantity']}</td>
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

  }

  displayIgnore_res = (file_type, ignore) => {

  }

  displayNoOverwrite_res = (file_type, no_ow) => {

  }

  render(){
    var res = this.props.import.check_res;
    var file_type = '';
    if(Object.keys(res).length > 0){
      file_type = res.file_type;
    }

    /*var file_headers = [];
    var obj_headers = [];
    if(file_type === 'ingredients'){
      file_headers = ["Ingr#", "Name", "Vendor Info", "Size", "Cost", "Comment"];
      obj_headers = ["number", "name", "vendor_info", "package_size", "cost_per_package", "comment"];
    }
    else if (file_type === 'skus') {
      file_headers = ["SKU#","Name","Case UPC","Unit UPC","Unit size","Count per case","PL Name","Comment", "Formula#", "Formula factor","Rate"];
      obj_headers = ["number", "name", "case_number", "unit_number", "unit_size", "count_per_case", "product_line", "comment"];
    }
    else if (file_type === 'product_lines') {
      file_headers = ["Name"];
      obj_headers = ["name"];
    }
    else if (file_type === 'formulas') {
      file_headers = ["SKU#", "Ingr#", "Quantity"];
      obj_headers = ["number", "name", "number"];
    }*/

    const import_res = this.props.import.import_res;
    console.log(import_res);
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
          <Modal size="xl" className="importSummary"
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
              {/*
              {Object.keys(import_res).length > 0 ? (
                <div style={{color: 'green'}}>
                  {(Object.entries(import_res).map(([name,value]) => (
                    (Object.keys(value).length > 0) ?
                    (<div key={name}>
                        <h4>{name === 'NoOverwrite'? ('No Overwrite'):(name)}: {value.count} records</h4>
                        {value.count > 0 ? (<Table responsive size="sm">
                          <thead>
                            <tr>
                              {file_headers.map((key) => (
                                <th key={key}> {key}</th>
                              ))}
                            </tr>
                          </thead>
                          {file_type === 'formulas'? (
                            value.records.map((obj,i) => (
                              <tbody key={i}>
                              <tr><td colSpan="3"><div><em>Formula {i}</em></div></td></tr>
                                {name === 'Overwrite'? (
                                  obj.ing_list.map((entry, k) => (
                                  <tr key={k}>
                                  {this.asst_ow_helper(entry, file_headers).map(([key,value], i) => (
                                    <td key={key}>{value}</td>
                                  ))}
                                  </tr>
                                ))
                                ): (
                                  obj.result.map((entry, j) => (
                                    <tr key={j}>
                                      {this.asst_ow_helper(entry[0], file_headers).map(([key,value]) => (
                                          <td key={key}>{value}</td>

                                        ))}
                                    </tr>
                                ))
                                )}

                            </tbody>
                          ))

                          ): (
                            <tbody>

                              {value.records.map((obj,i) => (
                                name === 'Store' ? (
                                  <tr key={i}>
                                    {this.asst_ow_helper(obj, obj_headers).map(([key,value]) => (

                                        <td key={key}>{value}</td>
                                      ))}
                                  </tr>
                                ):(
                                  name === 'Overwrite' ? (
                                    <tr key={i}>
                                      {this.ow_oldEntry_helper(obj, file_headers, obj_headers).map(([key,value]) => (

                                          <td key={key}>{value}</td>
                                        ))}
                                    </tr>
                                  ):(
                                    <tr key={i}>
                                      {this.asst_ow_helper(obj, file_headers).map(([key,value]) => (

                                          <td key={key}>{value}</td>
                                        ))}
                                    </tr>

                                  )

                                )

                              ))}
                            </tbody>
                          )}

                        </Table>):(<div></div>)}
                      </div>):
                    (
                      <div key={name}>
                        <h4>{name}</h4>
                        None
                      </div>
                    )
                  )))}
                </div>
              ): (<div>Import Incomplete</div>)}*/}
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
