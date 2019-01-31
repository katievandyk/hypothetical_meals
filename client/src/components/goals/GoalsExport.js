import React from 'react';
import { exportGoal } from '../../actions/goalsActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class GoalsExport extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.export = this.export.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  export(e) {
    const { goals } = this.props.goals;
    this.props.exportGoal(goals.find(goal => goal._id === e.currentTarget.id))
  }



  render() {
    const { goals } = this.props.goals;
    return (
      <div>
        <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle}>
          <DropdownToggle caret>
            Export Goal
          </DropdownToggle>
          <DropdownMenu>
             {goals.map(({_id, name}) => (
                  <DropdownItem onClick={this.export} id={_id} key={_id}>{name}</DropdownItem>
              ))}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
}

GoalsExport.propTypes = {
  exportGoal: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { exportGoal })(GoalsExport);
