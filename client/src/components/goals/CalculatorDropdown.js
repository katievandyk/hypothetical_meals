import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PropTypes from 'prop-types';

class CalculatorDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.state = {
      selectGoal: 'Select Goal',
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  changeValue(e) {
    this.setState({selectGoal: e.currentTarget.textContent})
    this.props.calculatorCallback(e.currentTarget.id)
  }

  render() {
    const { goals } = this.props.goals;
    return (
      <div>
        <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle}>
          <DropdownToggle caret>
            {this.state.selectGoal}
          </DropdownToggle>
          <DropdownMenu>
             {goals.map(({_id, name}) => (
                  <DropdownItem key={_id} id={_id} onClick={this.changeValue}>{name}</DropdownItem>
              ))}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
}

CalculatorDropdown.propTypes = {
  calculatorCallback: PropTypes.func.isRequired
};


export default CalculatorDropdown;