import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';

import {
  Container, Row, Col,
  FormGroup, Label, FormText, Card, CardHeader, CardBody,
  CardTitle, CardText, CardFooter, Table, Alert, Input
} from 'reactstrap';

import store from '../store';
import ImportAlerts from '../components/import/ImportAlerts'
import ImportAssistant from '../components/import/ImportAssistant'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { uploadCheck } from '../actions/importActions';

class Import extends Component {
  state = {
    dropdownOpen: false,
    fileObj: {},
    modal: false
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  modal_toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  onUploadFile = (e) => {
    let reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = function () {
      var fileContent = reader.result;
	    console.log(fileContent);
    }
    reader.onloadend = (e) => {
      const newFileObj = {file: reader.result};
      console.log(newFileObj);
      this.props.uploadCheck(newFileObj);
    }


    this.modal_toggle();
  }
   render() {
        return(
          <div>
            <AppNavbar />
            <ImportAlerts/>
            <Container>
                <Row>
                  <Col> <h1>Import</h1> </Col>
                  <Col> </Col>
                </Row>
                <Row>
                  <Card>
                   <CardHeader>Guidelines</CardHeader>
                   <CardBody>
                     <CardText>This import accepts CSV files complient with <a href="https://tools.ietf.org/html/rfc4180">RFC4180</a>.
                     Four different files can be uploaded (1 each for SKUs, Ingredients, Product Lines, and Formulas).
                      The file formats are specified for each in the table below.</CardText>
                    <Table>
                      <thead>
                        <tr>
                          <th>Filehead Prefix</th>
                          <th>Header</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            skus
                          </td>
                          <td>SKU#,Name,Case UPC,Unit UPC,Unit size,Count per case,Product Line Name,Comment</td>
                        </tr>
                        <tr>
                          <td>
                            ingredients
                          </td>
                          <td>Ingr#,Name,Vendor Info,Size,Cost,Comment</td>
                        </tr>
                        <tr>
                          <td>
                            product_lines
                          </td>
                          <td>Name</td>
                        </tr>
                        <tr>
                          <td>
                            formulas
                          </td>
                          <td>SKU#,Ingr#,Quantity</td>
                        </tr>

                      </tbody>
                    </Table>
                   </CardBody>
                 </Card>
                </Row>
                <FormGroup>
                <Label for="import-file">File</Label>
                <Input type="file" name="file" accept=".csv"
                  id="import-file" onChange={this.onUploadFile.bind(this)}/><FormText color="muted">
                  Upload a file.
                </FormText>
              </FormGroup>
            </Container>
            <ImportAssistant modal={this.state.modal} toggle={this.modal_toggle}/>
          </div>
        );
   }
}

Import.propTypes = {
  uploadCheck: PropTypes.func.isRequired,
  import: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  import: state.import
});

export default connect(mapStateToProps, {uploadCheck})(Import);
