import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export default class Example extends React.Component {
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
    return (
      <div>
        <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle}>
          <DropdownToggle caret>
            Export Goal
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem>Goal Ex) 1</DropdownItem>
            <DropdownItem>Goal Ex) 2</DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
}