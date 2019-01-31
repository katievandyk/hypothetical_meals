import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';

import {
  Container, Row, Col,
  FormGroup, Label, Input, FormText, Card, CardHeader, CardBody,
  CardTitle, CardText, CardFooter, Table
} from 'reactstrap';

class Import extends Component {
  state = {
    dropdownOpen: false
  };

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  onUploadFile = (e) => {
    console.log(e.target.files);
  }
   render() {
        return(
          <div>
            <AppNavbar />
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
                <Input type="file" name="file"
                  id="import-file" onChange={this.onUploadFile.bind(this)}/>
                <FormText color="muted">
                  Upload a file.
                </FormText>
              </FormGroup>
            </Container>
          </div>
        );
   }
}

export default Import;
