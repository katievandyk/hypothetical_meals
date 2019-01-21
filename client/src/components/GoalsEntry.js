import React from 'react';
import { Row, Col, Table } from 'reactstrap';
import { connect } from 'react-redux';
import { getGoals } from '../actions/goalsActions';
import PropTypes from 'prop-types';

class GoalsEntry extends React.Component {

  componentDidMount() {
    this.props.getGoals();
  }

  render() {
    const { goals } = this.props.goals;
    return (
      /**
        **/

        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU List</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(({_id, name, sku_list}) => (
            <tr key={_id}>
              <td> {name} </td>
              <td>
              <Row>
              {sku_list.map(({sku, quantity}) => (
                    <Col md={3}>{sku} ({quantity})</Col>
              ))}
              </Row>
              </td>
            </tr>
          ))}
          </tbody>
        </Table>

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
