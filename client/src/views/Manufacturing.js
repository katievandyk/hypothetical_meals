import React, { Component } from 'react';
import { Button } from 'reactstrap';
import AppNavbar from '../components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { getGoals } from '../actions/goalsActions';
import { getGoalsIngQuantity  } from '../actions/goalsActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import GoalsEntry from '../components/goals/GoalsEntry';
import CalculatorEntry from '../components/goals/CalculatorEntry';
import CalculatorDropdown from '../components/goals/CalculatorDropdown';
import GoalsCreateModal from '../components/goals/GoalsCreateModal';
import GoalsExport from '../components/goals/GoalsExport';
import CalculatorExport from '../components/goals/CalculatorExport';

import { Provider } from 'react-redux';
import store from '../store';

import { Container, Row, Col} from 'reactstrap';

const html2canvas = require('html2canvas');
const jsPDF = require('jspdf');

class Manufacturing extends Component {

  constructor(props) {
    super(props);
    this.calculatorCallback = this.calculatorCallback.bind(this);
    this.state = {
        calcGoal: ""
    };
    }

  componentDidMount() {
      this.props.getGoals();
  }

  calculatorCallback = goal => {
    const {goals} = this.props.goals
    const selGoal = goals.find(g => g._id == goal._id )
    this.setState({
        calcGoal : selGoal
    })
    this.props.getGoalsIngQuantity(goal._id);
   }


     exportPDF() {
       const input = document.getElementById('toPDF')
       html2canvas(input)
            .then((canvas) => {
                 var image = canvas.toDataURL("image/jpeg");
                 var doc = new jsPDF('l', 'mm');
                 var width = doc.internal.pageSize.getWidth();
                 var height = doc.internal.pageSize.getHeight();
                 doc.addImage(image, 'JPEG', 0, 0, width-20, height-10);
                 doc.save('myPage.pdf'); //Download the rendered PDF.
            });
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
                      <GoalsCreateModal buttonLabel="Create Goal"/> &nbsp;
                      <GoalsExport goals={this.props.goals}/>
                   </Row>
                </Container>
                <GoalsEntry/>
              </Container>
              </div>
              <div>
              <Container className="mt-5" id="toPDF">
                <Container className="my-3">
                    <Row>
                        <Col> <h1>Manufacturing Calculator</h1> </Col>
                    </Row>
                   <Row>
                      <Col style={{'textAlign': 'right'}}> </Col>
                      <CalculatorDropdown goals={this.props.goals} calculatorCallback={this.calculatorCallback}/> &nbsp;
                      <CalculatorExport goal={this.state.calcGoal}/> &nbsp;
                      <Button color="success" onClick={this.exportPDF}>PDF</Button>
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
