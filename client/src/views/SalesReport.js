import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import SalesReportGenerate from '../components/sales/SalesReportGenerate';
import SummaryReportDisplay from '../components/sales/SummaryReportDisplay';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { Provider } from 'react-redux';
import store from '../store';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getSummary } from '../actions/salesActions';

import {
  Container, Row, Col, Button,
  Modal, ModalBody, ModalHeader, ModalFooter
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SalesReport extends Component {

    constructor(props){
        super(props)
        this.generateReport = this.generateReport.bind(this);
        this.state = {
             reportGen: false,
        };
    };

    generateReport = (sku_ids, all_customers, sel_customer) => {
        if(!all_customers){
            this.props.getSummary(sku_ids, sel_customer)
        }
        else {
            this.props.getSummary(sku_ids)
        }
        this.setState({
          reportGen: true,
        });
    }

   render() {
     if(!this.state.reportGen){
        return(
          <Provider store={store}>
            <div>
              <div>
                <AppNavbar />
              </div>
              <Container>
              <Container className="mb-3">
                <Row>
                  <Col> <h1>Sales Report</h1> </Col>
                </Row>
                <Row>
                  <Col  style={{'textAlign': 'right'}}> <SalesReportGenerate generateReport={(sku_ids, all_customers, sel_customer) => this.generateReport(sku_ids, all_customers, sel_customer)}/> </Col>
                </Row>
                <Row>
                    <Col style={{'textAlign': 'center'}}>No summary report generated.</Col>
                </Row>
              </Container>
              </Container>
            </div>
          </Provider>
      );
     }
        return(
          <Provider store={store}>
            <div>
              <div>
                <AppNavbar />
              </div>
              <Container>
              <Container className="mb-3">
                <Row>
                  <Col> <h1>Sales Report</h1> </Col>
                </Row>
                <Row>
                  <Col  style={{'textAlign': 'right'}}> <SalesReportGenerate generateReport={(sku_ids, all_customers, sel_customer) => this.generateReport(sku_ids, all_customers, sel_customer)}/> </Col>
                </Row>
                <SummaryReportDisplay summary={this.props.summary}/>
              </Container>
              </Container>
            </div>
          </Provider>
      );
   }
}

SalesReport.propTypes = {
  getSummary: PropTypes.func.isRequired,
  sales: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  sales: state.sales
});

export default connect(mapStateToProps, { getSummary })(SalesReport);
