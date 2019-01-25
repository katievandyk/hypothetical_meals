import React from 'react';
import {Table } from 'reactstrap';
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
                  {skus_list.map(({_id, sku, quantity}) => (
                      <td key={_id}> {sku.name} ({quantity}) </td>
                  ))}
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
