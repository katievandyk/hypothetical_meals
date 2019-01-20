import React from 'react';
import { Table, Input, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { getIngs, deleteIng } from '../actions/ingActions';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class IngredientsEntry extends React.Component {

  componentDidMount() {
    this.props.getIngs();
  }

  onDeleteClick = id => {
    this.props.deleteIng(id);
    console.log('hey');
  };

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
              <CSSTransition key={_id} timeout={500} classNames="fade">
                <tr>
                  <td> {name} </td>
                  <td> {number} </td>
                  <td> {vendor_info} </td>
                  <td> {package_size} </td>
                  <td> {cost_per_package} </td>
                  <td> skus </td>
                  <td> {comment} </td>
                  <td> <Button size="sm" color="link" style={{'color':'black'}}> <FontAwesomeIcon icon = "edit"/> </Button> </td>
                  <td > <Button size="sm" color="link" onClick={this.onDeleteClick.bind(this, _id)} style={{'color':'black'}}><FontAwesomeIcon icon="trash"/> </Button></td>
                </tr>
              </CSSTransition>
          ))}
          </tbody>
        </Table>

    );
  }
}

IngredientsEntry.propTypes = {
  getIngs: PropTypes.func.isRequired,
  deleteIng: PropTypes.func.isRequired,
  ing: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  ing: state.ing
});

export default connect(mapStateToProps, { getIngs, deleteIng })(IngredientsEntry);
