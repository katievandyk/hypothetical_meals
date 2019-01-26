import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class GoalsExport extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
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
                  <DropdownItem key={_id}>{name}</DropdownItem>
              ))}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
}

export default GoalsExport;