import React from 'react';
import {
  Table,
  Container
 } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../styles.css'

class IngDepReport extends React.Component {

  render() {
    const report = this.props.ing.report;
    if(report.length > 0){
      return (
        <div>
          <Container>
          <h1>Ingredients Dependency Report</h1>
          {report.map((obj)=>(Object.entries(obj).map(([key,value])=> (
            <div key={key}><h3>{key} SKUs </h3>
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
              <div>No SKUs found</div>
            )}
            </div>
          ))
          ))}
          </Container>
        </div>
      );
    }
    else{
      return (
        <div style={{textAlign: 'center'}}>
          <h2>No reports generated</h2>
          Go to the <a href="./ingredients"> Ingredients Page </a> to
          generate an Ingredients Dependency Report
        </div>
      );
    }
  }
}

IngDepReport.propTypes = {
  ing: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ing: state.ing
});

export default connect(mapStateToProps)(IngDepReport);
