import React from 'react';
import { Table, Input } from 'reactstrap';
import { connect } from 'react-redux';
import { getIngs } from '../actions/ingActions';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class IngredientsEntry extends React.Component {

  componentDidMount() {
    this.props.getIngs();
  }

  render() {
    const { ings } = this.props.ing;
    return (
      /**
        **/


        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>#</th>
              <th>Vendor's Info</th>
              <th>Package Size</th>
              <th>Cost/Package</th>
              <th>SKUs List</th>
              <th>Comments</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {ings.map(({_id, name, number, vendor_info, package_size, cost_per_package, comment }) => (
            <tr key={_id}>
              <td> {name} </td>
              <td> {number} </td>
              <td> {vendor_info} </td>
              <td> {package_size} </td>
              <td> {cost_per_package} </td>
              <td> skus </td>
              <td> {comment} </td>
              <td> <FontAwesomeIcon icon = "edit"/> </td>
              <td > <FontAwesomeIcon icon="trash"/> </td>
            </tr>
          ))}
          </tbody>
        </Table>

    );
  }
}

IngredientsEntry.propTypes = {
  getIngs: PropTypes.func.isRequired,
  ing: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ing: state.ing
});

export default connect(mapStateToProps, { getIngs })(IngredientsEntry);
