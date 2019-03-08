import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import UsersEntry from '../components/auth/UsersEntry';
import RegisterComponent from '../components/auth/RegisterComponent';
import {
  Col, Row, Container
} from 'reactstrap';

class ManageUsers extends Component {
   render() {
       return(
         <div>
           <AppNavbar />
           <div>
             <Container>
                 <Container className="mb-3">
                    <Row>
                         <Col> <h1>Manage Users</h1> </Col>
                    </Row>
                    <Row>
                         <Col style={{'textAlign': 'right'}}> </Col>
                         <RegisterComponent />
                    </Row>
                </Container>
                <UsersEntry/>
             </Container>
           </div>
         </div>
       );
    }
}

export default ManageUsers;
