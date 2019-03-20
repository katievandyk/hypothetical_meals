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
import ReactChartkick, { LineChart } from 'react-chartkick'
import Chart from 'chart.js'


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
          <Row>
          <Col style={{marginBottom: '20px'}}>
            <h5 style={{marginBottom: '20px'}}>Sales Chart</h5>
            <LineChart data={{"2017-05-13": 2, "2017-05-14": 5}} />
          </Col>
          <Col md={4}>
            <h5 style={{marginBottom: '20px'}}>Totals</h5>
                  <Table responsive bordered size="sm">
                    <tbody>
                    <tr>
                       <td><b>Avg. Mfg. Run Size</b></td>
                       <td>{report.summary.average_run_size.toFixed(2)}</td>
                    </tr>
                    <tr>
                       <td><b>Ingredient Cost/Case</b></td>
                       <td>${report.summary.ing_cost_per_case.toFixed(2)}</td>
                    </tr>
                    <tr>
                       <td><b>Mfg. Setup Cost/Case</b></td>
                       <td>${report.summary.average_setup_cost.toFixed(2)}</td>
                    </tr>
                    <tr>
                       <td><b>Mfg. Run Cost/Case</b></td>
                       <td>${report.run_cost.toFixed(2)}</td>
                    </tr>
                    <tr>
                       <td><b>Total COGS/Case</b></td>
                       <td>${report.summary.cogs.toFixed(2)}</td>
                    </tr>
                    <tr>
                       <td><b>Avg. Revenue/Case</b></td>
                       <td>${report.summary.avgerage_revenue.toFixed(2)}</td>
                    </tr>
                    <tr>
                       <td><b>Avg. Profit/Case</b></td>
                       <td>${report.summary.average_profit.toFixed(2)}</td>
                    </tr>
                    <tr>
                       <td><b>Profit Margin</b></td>
                       <td>${report.summary.profit_margin.toFixed(2)}</td>
                    </tr>
                  </tbody>
                 </Table>
          </Col>
          </Row>
          <Row>
          <Col>
            <h5 style={{marginBottom: '20px', marginTop: '20px'}}>Sales Records</h5>
            <Table responsive size="sm">
                <thead>
                    <tr>
                        <th>Year</th>
                        <th>Week</th>
                        <th>Customer Name</th>
                        <th>Customer #</th>
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
                                <td> {obj.customer.name} </td>
                                <td> {obj.customer.number} </td>
                                <td> {obj.sales}</td>
                                <td> ${obj.price_per_case} </td>
                                <td> ${obj.revenue} </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                </Col>
            </Row>
          </Container>
        </div>
      );
      }
      else{
        return (
          <div style={{textAlign: 'center'}}>
             No sales records available for given date range.
          </div>
        );
      }
    }
  }

export default SKUDrillDownEntry;