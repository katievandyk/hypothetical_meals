import React from 'react';
import {
  Table,
  Container, Row, Col,
  Button,
  Spinner
 } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../styles.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

class SummaryReportDisplay extends React.Component {


  render() {
    const report = this.props.sales.summary;
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
    else if(report.length > 0){
      return (
        <div>
          <Container>
          {report.map((obj)=>(Object.entries(obj).map(([key,value])=> (
            <div key={key}><h3>{key} Product Line </h3>
            {value.length> 0? (
              <Table responsive size="sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>#</th>
                    <th>Case UPC#</th>
                    <th>Unit UPC#</th>
                    <th>Unit Size</th>
                    <th>Count/Case</th>
                  </tr>
                </thead>
                <tbody>
                  {value.map(({_id, name, number, case_number, unit_number,
                    unit_size, count_per_case})=> (
                      <tr key={_id}>
                        <td> {name} </td>
                        <td> {number} </td>
                        <td> {case_number} </td>
                        <td> {unit_number} </td>
                        <td> {unit_size} </td>
                        <td> {count_per_case}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            ):(
              <div>No Product Lines found</div>
            )}
            </div>
          ))
          ))}
          <Row>
             <Col style={{'textAlign': 'right'}}/>
             <Button>Export</Button>
          </Row>
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

SummaryReportDisplay.propTypes = {
  sales: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  sales: state.sales
});

export default connect(mapStateToProps, {} )(SummaryReportDisplay);