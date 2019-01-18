import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import IngredientsSKUsDropdown from '../components/IngredientsSKUsDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import {
  Table,
  Container, Row, Col
} from 'reactstrap';

class Ingredient extends Component {
   render() {
        return(
        <div>
          <div>
            <AppNavbar />
          </div>
          <Container>
          <Container className="mb-3">
            <h1>Ingredients</h1>
            <Row>
              <Col> <IngredientsSKUsDropdown /> </Col>
            </Row>
          </Container>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>#</th>
                  <th>Vendors Info</th>
                  <th>Package Size</th>
                  <th>Cost/Package</th>
                  <th>SKUs List</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td> name </td>
                  <td> 1 </td>
                  <td> vinfo </td>
                  <td> pkg size </td>
                  <td> cost pkg </td>
                  <td> skus </td>
                  <td> cmmts </td>
                </tr>
              </tbody>
            </Table>
          </Container>
        </div>
      );
   }
}

export default Ingredient;
