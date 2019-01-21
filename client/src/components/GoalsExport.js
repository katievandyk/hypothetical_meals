import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import { getGoals } from '../actions/goalsActions';
import PropTypes from 'prop-types';

class GoalsExport extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  componentDidMount() {
      this.props.getGoals();
  }


  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
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
                  <DropdownItem>{name}</DropdownItem>
              ))}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
}

GoalsExport.propTypes = {
  getGoals: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  goals: state.goals
});

export default connect(mapStateToProps, { getGoals })(GoalsExport);