import React, { Component } from 'react';
import { Button } from 'reactstrap';
import AppNavbar from '../components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { getGoals } from '../actions/goalsActions';
import { getGoalsIngQuantity  } from '../actions/goalsActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'jspdf-autotable';
import * as jsPDF from 'jspdf';

import GoalsEntry from '../components/goals/GoalsEntry';
import CalculatorEntry from '../components/goals/CalculatorEntry';
import CalculatorDropdown from '../components/goals/CalculatorDropdown';
import GoalsCreateModal from '../components/goals/GoalsCreateModal';
import GoalsExport from '../components/goals/GoalsExport';
import CalculatorExport from '../components/goals/CalculatorExport';

import { Provider } from 'react-redux';
import store from '../store';

import { Container, Row, Col} from 'reactstrap';

class Manufacturing extends Component {

  constructor(props) {
    super(props);
    this.calculatorCallback = this.calculatorCallback.bind(this);
    this.exportPDF = this.exportPDF.bind(this);
    this.refresh = this.refresh.bind(this);
    this.state = {
        calcGoal: '',
        disableExport: true
    };
    }

  componentDidMount() {
      this.props.getGoals();
  }

  calculatorCallback = goal => {
    const {goals} = this.props.goals
    const selGoal = goals.find(g => g._id === goal._id )
    this.setState({
        calcGoal : selGoal,
        disableExport: false
    })
    this.props.getGoalsIngQuantity(goal._id);
   }

   exportPDF = () => {
     const input = document.getElementById("toPDF")
     var doc = new jsPDF('l', 'pt');
     doc.text(20, 40, this.state.calcGoal.name);
     var res = doc.autoTableHtmlToJson(input);
     doc.autoTable(res.columns, res.data, { margin: { top: 50, left: 20, right: 20, bottom: 0 }});
     doc.save(this.state.calcGoal.name + '_calculator.pdf'); //Download the rendered PDF.
   }

   refresh = () => {
       window.location.reload();
   }

   render() {
        return(
          <Provider store={store}>
            <div>
              <div>
                <AppNavbar />
              </div>
              <Container>
                <Container className="mb-3">
                   <Row>
                        <Col> <h1>Manufacturing Goals</h1> </Col>
                   </Row>
                   <Row>
                      <Col style={{'textAlign': 'right'}}> </Col>
                      <GoalsCreateModal refresh={this.refresh} buttonLabel="Create Goal"/> &nbsp;
                      <GoalsExport goals={this.props.goals}/>
                   </Row>
                </Container>
                <GoalsEntry/>
              </Container>
              </div>
              <div>
              <Container className="mt-5">
                <Container className="my-3">
                    <Row>
                        <Col> <h1>Manufacturing Calculator</h1> </Col>
                    </Row>
                   <Row>
                      <Col style={{'textAlign': 'right'}}> </Col>
                      <CalculatorDropdown goals={this.props.goals} calculatorCallback={this.calculatorCallback}/> &nbsp;
                      <CalculatorExport disableExport={this.state.disableExport} goal={this.state.calcGoal}/> &nbsp;
                      <Button disabled={this.state.disableExport} color="success" onClick={this.exportPDF}>PDF</Button>
                   </Row>
                </Container>
                <CalculatorEntry ingredients={this.props.goals.ing_quantities}/>
              </Container>
              </div>
          </Provider>
      );
   }
}

Manufacturing.propTypes = {
  getGoals: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
  getGoalsIngQuantity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  goals: state.goals,
});

export default connect(mapStateToProps, { getGoals, getGoalsIngQuantity })(Manufacturing);
