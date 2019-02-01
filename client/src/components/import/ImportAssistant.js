import React, { Component } from 'react';

import {
  Modal, ModalHeader, ModalBody, ModalFooter, Table, Button,
  CustomInput
} from 'reactstrap';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { uploadCheck } from '../../actions/importActions';

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
    const new_no_ow = this.props.import.check_res.Overwrite.filter(function(entry){
      return (new_ow.indexOf(entry) === -1)
    });
  }

  onCancel = () => {
    this.setState({
      new_overWrite: []
    });
  }

  render(){
    const res = this.props.import.check_res;
    console.log('res', res);
    var ow = res.Overwrite ? res.Overwrite : [];
    var ow_keys = [];
    if(res.length > 0){
      this.componentDidMount();
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
            <Table responsive size="sm">
              <thead>
                <tr>
                  <th>Overwrite?</th>
                {ow_keys.filter(function(entry){
                  return !(entry === 'ing_id' ||  entry === 'sku_id'||
                  entry ==='pl_id' || entry === 'status' || entry === 'to_overwrite')
                }).map((key)=> (
                  <th key={key}>{key}</th>
                ))}

                </tr>
              </thead>

                {ow.map((obj,i) => (
                  <tbody key={i}>
                  <tr key={i}>
                    <td><CustomInput key={i} type="checkbox" id={i}
                    onChange={(e) => {this.onChange(e, i, obj)}}inline/></td>
                    {Object.entries(obj).filter(function(entry){
                      return !(entry[0] === 'ing_id' || entry[0] === 'sku_id'||
                      entry[0] ==='pl_id' || entry[0] === 'status' || entry[0]==='to_overwrite')
                    }).map(([key,value]) => (
                      <td key={key}>{value}</td>
                    ))}

                  </tr>
                  <tr style={{backgroundColor:'#d3d3d3'}}>
                    <td>Current Entry</td>
                    {Object.entries(obj.to_overwrite).filter(function(entry){
                      return !(entry[0] === 'ing_id' || entry[0] === 'sku_id'||
                      entry[0] ==='pl_id' || entry[0] === '__v' || entry[0]==='_id')
                    }).map(([key,value]) => (
                      <td key={key}>{value}</td>
                    ))}
                  </tr>
                  </tbody>
                ))}
            </Table>
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
  import: PropTypes.object.isRequired,
  modal: PropTypes.bool.isRequired,
  toggle:PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  import: state.import
});

export default connect(mapStateToProps, {uploadCheck})(ImportAssistant);
