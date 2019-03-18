import React from 'react';
import {
  Table,
  Container, Row, Col,
  Button,
  Spinner,
  Modal, ModalBody, ModalHeader, ModalFooter
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
        curr_sku: ''
      };
    }

    sku_clicked = (sku) => {


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
        <Modal isOpen={this.state.skulist_modal} size="lg">
             <ModalHeader>Add a SKU, Quantity Tuple</ModalHeader>
                <ModalBody>

                </ModalBody>
             <ModalFooter>
                <Button disabled={this.state.validNum === 'failure' || this.state.sku_valid !== 'success'} onClick={this.onAddSKU}>Save</Button>
              <Button onClick={this.skulist_toggle}>Cancel</Button>
             </ModalFooter>
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