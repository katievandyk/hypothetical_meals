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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SummaryReportDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summary_modal: false,
      sku_drilldown_modal: false,
      curr_sku: {}
    };
  }

  summary_toggle = () => {
     this.setState({
       summary_modal: !this.state.summary_modal,
     });
  }

  sku_clicked = (sku) => {
    this.setState({
      curr_sku: sku
    });
    this.summary_toggle();
  }

  render() {
    const report = this.props.sales.summary;
    const pline_groups = this.props.sales.pline_groups;
    const loading = this.props.sales.loading;
    if(loading){
      return (
        <div style={{'textAlign':'center'}}>
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="success" />
          <Spinner type="grow" color="success" />
        </div>

      );
    }
    else if(Object.entries(pline_groups).length > 0 && report.length > 0){
      return (
        <div>
          <Container>
            {Object.entries(pline_groups).map(([key, value]) =>(
                <div key={key}><h3>{key} Product Line </h3>
                    {value.length> 0? (
                      <Table responsive size="sm">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Unit Size</th>
                            <th>Count/Case</th>
                            <th>SKU Summary</th>
                          </tr>
                        </thead>
                        <tbody>
                          {value.map((sku)=> (
                              <tr key={sku._id}>
                                <td> {sku.name} </td>
                                <td> {sku.unit_size} </td>
                                <td> {sku.count_per_case}</td>
                                <td>
                                    <Button size="sm" color="link"
                                    onClick={this.sku_clicked.bind(this, sku)}
                                    style={{'color':'black'}}>
                                    <FontAwesomeIcon icon="list"/>
                                    </Button>
                                </td>
                              </tr>

                            ))}
                        </tbody>
                      </Table>
                    ):(
                      <div>No Product Lines found</div>
                    )}
                </div>
        ))}
        <Row>
           <Col style={{'textAlign': 'right'}}/>
           <Button>Export</Button>
        </Row>
        </Container>
        <Modal isOpen={this.state.summary_modal} toggle={this.summary_toggle} size="lg">
             <ModalHeader>Summary for {this.state.curr_sku.name}</ModalHeader>
                <ModalBody>
                   <Table responsive size="sm">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Revenue</th>
                        <th>Sales</th>
                        <th>Average</th>
                      </tr>
                    </thead>
                        <tbody>
                        {report.find(elem => elem.sku === this.state.curr_sku._id) && report.find(elem => elem.sku === this.state.curr_sku._id).entries.map(({revenue, sales, year, average}) => (
                           <tr key={year}>
                                    <td> {year} </td>
                                    <td> {revenue} </td>
                                    <td> {sales} </td>
                                    <td> {average} </td>
                           </tr>
                        ))}
                        </tbody>
                  </Table>
                </ModalBody>
        </Modal>
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

SummaryReportDisplay.propTypes = {
  sales: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  sales: state.sales
});

export default connect(mapStateToProps, {} )(SummaryReportDisplay);