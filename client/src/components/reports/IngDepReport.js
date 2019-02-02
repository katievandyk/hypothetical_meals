import React from 'react';
import {
  Table, Button, Spinner,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem
 } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles.css'

class IngDepReport extends React.Component {

  componentDidMount(){
    console.log(this.props.ing.report);
  }

  render() {
    const report = this.props.ing.report;
    console.log(report);
    console.log(this.props.ing.report);
    if(report.length > 0){
      return (
        <div>
          <h1>Ingredients Dependency Report</h1>
          {report.map((key)=>(
            console.log(key)
          ))}
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
