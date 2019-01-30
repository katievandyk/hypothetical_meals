import React from 'react';
import { Button, Table, Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem } from 'reactstrap';
import { connect } from 'react-redux';
import { getGoals } from '../../actions/goalsActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

class GoalsEntry extends React.Component {
  state = {
    sku_modal: false,
    curr_list: [],
    curr_goal: ""
  };

  componentDidMount() {
    this.props.getGoals();
  }

  sku_toggle = () => {
      this.setState({
        sku_modal: !this.state.sku_modal,
      });
  }

  sku_clicked = (list, goal) => {
      this.setState({
        curr_list: list,
        curr_goal: goal
      });
      this.sku_toggle();
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
                </tr>
              </thead>
              <tbody>
                {goals.map(({ _id, name, skus_list}) => (
                    <tr key={_id}>
                      <td> {name} </td>
                      <td>
                        <Button size="sm" color="link"
                        onClick={this.sku_clicked.bind(this, skus_list, name)}
                        style={{'color':'black'}}>
                        <FontAwesomeIcon icon="list"/>
                        </Button>
                      </td>
                    </tr>
              ))}
              </tbody>
            </Table>
             <Modal isOpen={this.state.sku_modal} toggle={this.sku_toggle}>
                      <ModalHeader toggle={this.sku_toggle}>SKU List for {this.state.curr_goal}</ModalHeader>
                      <ModalBody>
                        <Table>
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                        {this.state.curr_list.map(({_id, sku, quantity}) => (
                            <tr key={_id}>
                                <td> {sku.name} </td>
                                <td> {quantity} </td>
                            </tr>
                          ))}
                          </tbody>
                        </Table>
                      </ModalBody>
           </Modal>
       </div>

    );
  }
}

GoalsEntry.propTypes = {
  getGoals: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  goals: state.goals
});

export default connect(mapStateToProps, { getGoals })(GoalsEntry);
