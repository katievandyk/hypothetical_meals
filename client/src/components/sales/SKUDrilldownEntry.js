import React from 'react';
import {
  Table,
  Container, Row, Col,
  Button,
  Spinner,
  Modal, ModalBody, ModalHeader
 } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../styles.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class SKUDrillDownEntry extends React.Component {

  render() {
    const report = this.props.sku_drilldown;
    const loading = this.props.loading;
    if(loading){
      return (
        <div style={{'textAlign':'center'}}>
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="success" />
        </div>
      );
    }
    else if(report.entries && report.entries.length > 0){
      return (
        <div>
          <Container>
            <Table responsive size="sm">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Week</th>
                        <th>Customer #</th>
                        <th>Customer Name</th>
                        <th>Sales</th>
                         <th>Price/Case</th>
                        <th>Revenue</th>
                      </tr>
                </thead>
                <tbody>
                    {report.entries.map((obj) =>(
                              <tr key={obj._id}>
                                <td> {obj.year} </td>
                                <td> {obj.week} </td>
                                <td> {obj.customer.number} </td>
                                <td> {obj.customer.name} </td>
                                <td> {obj.sales}</td>
                                <td> ${obj.price_per_case} </td>
                                <td> ${obj.revenue} </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                </Container>
        </div>
      );
      }
      else{
        return (
          <div style={{textAlign: 'center'}}>
             Error rendering report.
          </div>
        );
      }
    }
  }

export default SKUDrillDownEntry;