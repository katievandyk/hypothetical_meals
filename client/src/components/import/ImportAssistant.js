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
    new_overWrite: []
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
      new_overWrite: []
    });
    const new_no_ow = this.props.import.check_res.Overwrite.filter(function(entry){
      return (new_ow.indexOf(entry) === -1)
    });
    const new_checkRes = this.props.import.check_res;
    new_checkRes.Overwrite = new_ow;
    new_checkRes.NoOverwrite = new_no_ow;
    const fileName = this.props.import.check_res.file_type;
    if(fileName === 'product_lines'){
      fileName = 'productlines';
    }
    this.props.importOverwrites(new_checkRes, fileName);
    console.log('new_checkRes', new_checkRes);
    //this.props.importOverwrites(this.props.import.check_res, 'ingredients');
    this.props.toggle();
  }

  onCancel = () => {
    this.setState({
      new_overWrite: []
    });
  }

  ow_oldEntry_helper = (oldEntry, file_headers, obj_headers) => {
    var new_ow_arr = [];
    var i;
    for (i = 0; i < file_headers.length; i++) {
      var newkv = ['', ''];
      newkv[0] = file_headers[i];
      newkv[1] = oldEntry[obj_headers[i]];
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

  render(){
    const res = this.props.import.check_res;
    console.log(res);
    var file_type = '';
    var ow_keys = [];
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
    }
    else if (file_type === 'formulas') {
      file_headers = ["SKU#", "Ingr#", "Quantity"];
    }

    if(ow.length > 0){
      ow_keys = Object.keys(res.Overwrite[0]);
    }
    return (
      <Modal size="xl" isOpen={this.props.modal} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}> Import Options and Overview </ModalHeader>
        <ModalBody>
          <div key="Overwrite">
          <h4>Overwrite</h4>
          {ow.length > 0 ? (
            file_type === 'formulas' ? (
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
                        {this.asst_ow_helper(entry[0], file_headers, obj_headers).map(([key,value]) => (
                            <td key={key}>{value}</td>
                          ))}
                      </tr>
                    ))}
                    <tr style={{backgroundColor:'#d3d3d3'}}>
                      <td>Current Entry</td>
                      {this.asst_ow_helper(obj.result, file_headers, obj_headers).map(([key,value]) => (
                        <td key={key}>{value}</td>
                      ))}
                    </tr>
                    <tr><td></td></tr>
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
                    <tr style={{backgroundColor:'#d3d3d3'}}>
                      <td>Current Entry</td>
                      {this.ow_oldEntry_helper(obj.to_overwrite, file_headers, obj_headers).map(([key,value]) => (
                        <td key={key}>{value}</td>
                      ))}
                    </tr>
                    </tbody>
                  ))}
              </Table>
            )


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
                        entry ==='pl_id' || entry === 'status')
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
                          entry[0] ==='pl_id' || entry[0] === 'status')
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
