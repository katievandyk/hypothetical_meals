import React from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CalculatorEntry from './CalculatorEntry';
import CalculatorDropdown from './CalculatorDropdown';
import CalculatorExport from './CalculatorExport';

import 'jspdf-autotable';
import * as jsPDF from 'jspdf';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getGoals } from '../../actions/goalsActions';
import { getGoalsIngQuantity  } from '../../actions/goalsActions';

class GoalsEntry extends React.Component {
    constructor(props) {
      super(props);
      this.exportPDF = this.exportPDF.bind(this);
      this.state = {
        sku_modal: false,
        calculator_modal: false,
        curr_list: [],
        curr_goal: {},
      };
    }

  componentDidMount() {
    this.props.getGoals(this.props.auth.user_email);
  }

  sku_toggle = () => {
      this.setState({
        sku_modal: !this.state.sku_modal,
      });
  }

  calculator_toggle = () => {
      this.setState({
        calculator_modal: !this.state.calculator_modal,
      });
  }

   exportPDF = () => {
     const input = document.getElementById("toPDF")
     var doc = new jsPDF('l', 'pt');
     doc.text(20, 40, this.state.curr_goal.name);
     var res = doc.autoTableHtmlToJson(input);
     doc.autoTable(res.columns, res.data, { margin: { top: 50, left: 20, right: 20, bottom: 0 }});
     doc.save(this.state.curr_goal.name + '_calculator.pdf'); //Download the rendered PDF.
   }

  sku_clicked = (list, goal_id) => {
      const {goals} = this.props.goals
      const selGoal = goals.find(g => g._id === goal_id )
      this.setState({
        curr_list: list,
        curr_goal: selGoal
      });
      this.sku_toggle();
  }

  calculator_clicked = goal_id => {
    const {goals} = this.props.goals
    const selGoal = goals.find(g => g._id === goal_id )
    this.setState({
        curr_goal : selGoal
    })
    this.props.getGoalsIngQuantity(goal_id);
    this.calculator_toggle();
   }

  render() {
    const { goals } = this.props.goals;
    return (
        <div>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU List</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {goals.map(({ _id, name, skus_list}) => (
                    <tr key={_id}>
                      <td>
                        <Button color="link"
                        onClick={this.calculator_clicked.bind(this, _id)}
                        style={{'color':'black'}}>
                        {name}
                        </Button>
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={this.sku_clicked.bind(this, skus_list, _id)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="list"/>
                        </Button>
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="edit"/>
                        </Button>
                      </td>
                      <td>
                        <Button size="sm" color="link"
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="trash"/>
                        </Button>
                      </td>
                    </tr>
              ))}
              </tbody>
            </Table>
             <Modal isOpen={this.state.sku_modal} toggle={this.sku_toggle} size="lg">
                      <ModalHeader toggle={this.sku_toggle}>SKU List for {this.state.curr_goal.name}</ModalHeader>
                      <ModalBody>
                        <Table>
                          <thead>
                            <tr>
                              <th>SKU</th>
                              <th>Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                        {this.state.curr_list.map(({_id, sku, quantity}) => (
                            <tr key={_id}>
                                <td> {sku.name}: {sku.unit_size} * {sku.count_per_case}</td>
                                <td> {quantity} </td>
                            </tr>
                          ))}
                          </tbody>
                        </Table>
                      </ModalBody>
           </Modal>
           <Modal isOpen={this.state.calculator_modal} toggle={this.calculator_toggle} size="lg">
                      <ModalHeader toggle={this.calculator_toggle}> Calculator Results for {this.state.curr_goal.name}</ModalHeader>
                      <ModalBody>
                          <CalculatorEntry ingredients={this.props.goals.ing_quantities}/>
                      </ModalBody>
                      <ModalFooter>
                          <CalculatorExport goal={this.state.curr_goal}/> &nbsp;
                          <Button disabled={this.state.disableExport} color="success" onClick={this.exportPDF}>PDF</Button>
                      </ModalFooter>
           </Modal>
       </div>

    );
  }
}

GoalsEntry.propTypes = {
  getGoals: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
  getGoalsIngQuantity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  goals: state.goals,
  auth: state.auth
});

export default connect(mapStateToProps, { getGoals, getGoalsIngQuantity })(GoalsEntry);
