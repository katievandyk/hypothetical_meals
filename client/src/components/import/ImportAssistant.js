import React, { Component } from 'react';

import {
  Modal, ModalHeader, ModalBody, ModalFooter, Table, Button,
  CustomInput
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { uploadCheck, importOverwrites } from '../../actions/importActions';

class ImportAssistant extends Component {
  state = {
    new_overWrite: [],
    results_modal: false
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
  render(){
    const res = this.props.import.check_res;
    var file_type = '';
    var ow = [];
    if(Object.keys(res).length > 0){
      file_type = res.file_type;
      ow = res.Overwrite;
    }

    var file_headers = [];
    var obj_headers = [];
    if(file_type === 'ingredients'){
      file_headers = ["Ingr#", "Name", "Vendor Info", "Size", "Cost", "Comment"];
      obj_headers = ["number", "name", "vendor_info", "package_size", "cost_per_package", "comment"];
    }
    else if (file_type === 'skus') {
      file_headers = ["SKU#","Name","Case UPC","Unit UPC","Unit size","Count per case","Product Line Name","Comment"];
      obj_headers = ["number", "name", "case_number", "unit_number", "unit_size", "count_per_case", "product_line", "comment"];
    }
    else if (file_type === 'product_lines') {
      file_headers = ["Name"];
      obj_headers = ["name"];
    }
    else if (file_type === 'formulas') {
      file_headers = ["SKU#", "Ingr#", "Quantity"];
    }

    const import_res = this.props.import.import_res;
    return (
      <div>
      <Modal size="xl" isOpen={this.props.modal && this.props.import.success} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}> Import Options and Overview </ModalHeader>
        <ModalBody>
          <div>Below is a summary of what will happen if the import proceeds. Please make the necessary
          selections for what you would like to happen for conflicts and proceed to submit your import. </div>
          <div key="Overwrite">
          <h4>Overwrite</h4>
          {ow.length > 0 ? (
            <div>
            <div>These are the entries from your imported file that would overwrite existing entries. Check the box
            next to the entries you would like to overwrite. The original entries are also displayed in grey below your imported entry.</div>
          { file_type === 'formulas' ? (
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Overwrite?</th>
                  {file_headers.map((key)=> (
                    <th key={key}>{key}</th>
                  ))}

                  </tr>
                </thead>

                  {ow.map((obj,i) => (
                    <tbody key={i}>
                    <tr key={i}>
                      <td><CustomInput key={i} type="checkbox" id={i}
                      onChange={(e) => {this.onChange(e, i, obj)}}inline/> Formula {i}</td>
                    </tr>
                    {obj.result.map((entry, i) => (
                      <tr key={i}>
                        <td></td>
                        {this.asst_ow_helper(entry[0], file_headers).map(([key,value]) => (
                            <td key={key}>{value}</td>
                          ))}
                      </tr>
                    ))}
                    {this.old_formulas_helper(obj.to_overwrite, obj.result[0][0]["SKU#"])}
                    <tr><td colSpan="4"></td></tr>
                    </tbody>
                  ))}
              </Table>
            ): (
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Overwrite?</th>
                  {file_headers.map((key)=> (
                    <th key={key}>{key}</th>
                  ))}

                  </tr>
                </thead>

                  {ow.map((obj,i) => (
                    <tbody key={i}>
                    <tr key={i}>
                      <td><CustomInput key={i} type="checkbox" id={i}
                      onChange={(e) => {this.onChange(e, i, obj)}}inline/></td>
                    {this.asst_ow_helper(obj, file_headers, obj_headers).map(([key,value]) => (
                        <td key={key}>{value}</td>
                      ))}

                    </tr>
                    <tr style={{backgroundColor:'#d3d3d3', fontStyle:'italic'}}>
                      <td>Current Entry</td>
                      {this.ow_oldEntry_helper(obj.to_overwrite, file_headers, obj_headers).map(([key,value]) => (
                        <td key={key}>{value}</td>
                      ))}
                    </tr>
                    </tbody>
                  ))}
              </Table>
            )
          }
          </div>


          ): (
            <div>
              None
              </div>
          )}

          </div>
          {(Object.entries(res).filter(function(entry){
            return (entry[0] === 'Ignore' || entry[0] === 'Store')
          }).map(([name,value]) => (
            (value.length > 0) ?
            (<div key={name}>
                <h4>{name}</h4>
                <Table>
                  <thead>
                    <tr>
                      {Object.keys(value[0]).filter(function(entry){
                        return !(entry === 'ing_id' ||  entry === 'sku_id'||
                        entry ==='pl_id' || entry === 'status' || entry === 'pl_name')
                      }).map((key) => (
                        <th key={key}> {key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {value.map((obj,i) => (
                      <tr key={i}>
                        {Object.entries(obj).filter(function(entry){
                          return !(entry[0] === 'ing_id' || entry[0] === 'sku_id'||
                          entry[0] ==='pl_id' || entry[0] === 'status' || entry[0] === 'pl_name')
                        }).map(([key,value]) => (
                          <td key={key}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>):
            (
              <div key={name}>
                <h4>{name}</h4>
                None
              </div>
            )
          )))}

        </ModalBody>
        <ModalFooter>
          <Button onClick={this.submitImport}>Submit Import Decisions</Button>
          <Button onClick={this.onCancel} color="danger">Cancel</Button>
        </ModalFooter>
    </Modal>
      <Modal size="xl" isOpen={this.state.results_modal} toggle={this.results_modal_toggle}>
        <ModalHeader toggle={this.results_modal_toggle}>
          Import Results
        </ModalHeader>
        <ModalBody>
          {Object.keys(import_res).length > 0 ? (
            <div>
              {(Object.entries(import_res).map(([name,value]) => (
                (Object.keys(value).length > 0) ?
                (<div key={name}>
                    <h4>{name}: {value.count} records</h4>
                    {value.count > 0 ? (<Table responsive size="sm">
                      <thead>
                        <tr>
                          {file_headers.map((key) => (
                            <th key={key}> {key}</th>
                          ))}
                        </tr>
                      </thead>
                      {file_type === 'formulas'? (
                        <tbody>
                          {value.records.map((obj,i) => (

                            <tr key={i}>
                              {this.asst_ow_helper(obj.result[0][0], file_headers).map(([key,value]) => (
                                  <td key={key}>{value}</td>
                                ))}
                            </tr>
                          ))}
                        </tbody>
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
                              <tr key={i}>
                                {this.asst_ow_helper(obj, file_headers).map(([key,value]) => (

                                    <td key={key}>{value}</td>
                                  ))}
                              </tr>
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
          ): (<div>Import Incomplete</div>)}
        </ModalBody>
      </Modal>
    </div>
    );
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
