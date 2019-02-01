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
    new_overWrite: [],
    new_noOverWrite: []
  }

  componentDidMount = () => {

  }

  update_state_ow = () => {
    if(this.props.import.check_res.Overwrite){
      this.setState({
        new_overWrite: this.props.import.check_res.Overwrite
      });
    }
  }

  onChange = (e, i) => {
    if(e.target.checked){

    }
    else{ //target not checked, remove from new_overWrite obj
      const orig_ow = this.props.import.check_res.Overwrite;
      const rem_obj = orig_ow[i];
      const new_ow = this.props.import.check_res.Overwrite.splice(i, 1);
      console.log(new_ow);

    }

  }

  render(){
    const res = this.props.import.check_res;
    //const ow_keys = Object.keys(res.Overwrite[0].result[0]);
    var ow = res.Overwrite ? res.Overwrite : [];
    var ow_keys = [];
    if(res.length > 0){
      this.componentDidMount();
    }
    if(ow.length > 0){
      ow_keys = Object.keys(res.Overwrite[0]);
    }
    return (
      <Modal size="lg" isOpen={this.props.modal} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}> Import Options and Overview </ModalHeader>
        <ModalBody>
          <div key="Overwrite">
          <h4>Overwrite</h4>
          {ow.length > 0 ? (
            <Table responsive size="sm">
              <thead>
                <tr>
                {ow_keys.splice(0, ow_keys.length -2).map((key)=> (
                  <th key={key}>{key}</th>
                ))}
                  <th>Overwrite?</th>
                </tr>
              </thead>
              <tbody>
                {ow.map((obj,i) => (
                  <tr key={i}>
                    {Object.entries(obj).splice(0, Object.entries(obj).length - 2).map(([key,value]) => (
                      <td key={key}>{value}</td>
                    ))}
                    <td><CustomInput key={i} type="checkbox" id={i}
                    defaultChecked="true"
                    onChange={(e) => {this.onChange(e, i)}}inline/></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ): (
            <div>
              None
              </div>
          )}

          </div>
          {(Object.entries(res).filter(function(entry){
            return (entry[0] == 'Ignore' || entry[0] == 'Store')
          }).map(([name,value]) => (
            (value.length > 0) ?
            (<div key={name}>
                <h4>{name}</h4>
                <Table>
                  <thead>
                    <tr>
                      {Object.keys(value[0]).splice(0,
                        Object.keys(value[0]).length - 1).map((key) => (
                        <th key={key}> {key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {value.map((obj,i) => (
                      <tr key={i}>
                        {Object.entries(obj).splice(0, Object.entries(obj).length - 1).map(([key,value]) => (
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
          <Button>Submit Import Decisions</Button>
          <Button color="danger">Cancel</Button>
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
