import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

import { getGoals } from '../actions/goalsActions';
import { getSKUsIngQuantity  } from '../actions/skuActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import GoalsEntry from '../components/goals/GoalsEntry';
import CalculatorEntry from '../components/goals/CalculatorEntry';
import CalculatorDropdown from '../components/goals/CalculatorDropdown';
import GoalsCreateModal from '../components/goals/GoalsCreateModal';
import GoalsExport from '../components/goals/GoalsExport';

import { Provider } from 'react-redux';
import store from '../store';

import { Container, Row, Col} from 'reactstrap';

class Manufacturing extends Component {

  constructor(props) {
    super(props);
    this.calculatorCallback = this.calculatorCallback.bind(this);
    }

  componentDidMount() {
      this.props.getGoals();
  }

  calculatorCallback = goal => {
    var ids = [];
    goal.skus_list.forEach(entry => ids.push(entry.sku._id));
    const sku_ids = {
        skus: ids
    };
    // get ingredients per sku t
    this.props.getSKUsIngQuantity(sku_ids);
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
              <Container className="mt-5">
                <Container className="my-3">
                    <Row>
                        <Col> <h1>Manufacturing Calculator</h1> </Col>
                    </Row>
                   <Row>
                      <Col style={{'textAlign': 'right'}}> </Col>
                      <CalculatorDropdown goals={this.props.goals} calculatorCallback={this.calculatorCallback}/>
                   </Row>
                </Container>
                <CalculatorEntry ingredients={this.props.skus.ing_quantities}/>
              </Container>
            </div>
          </Provider>
      );
   }
}

Manufacturing.propTypes = {
  getGoals: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
  getSKUsIngQuantity: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  goals: state.goals,
  skus: state.skus
});

export default connect(mapStateToProps, { getGoals, getSKUsIngQuantity })(Manufacturing);
