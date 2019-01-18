import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Table, Container } from 'reactstrap';

class Ingredient extends Component {
   render() {
        return(
        <div>
          <div>
            <AppNavbar />
          </div>
          <Container>
          <h1>Ingredients</h1>
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
              </tbody>
            </Table>
          </Container>
        </div>
      );
   }
}

export default Ingredient;
