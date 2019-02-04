import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class GoalsSKUDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.state = {
      skuValue: 'SKU',
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  changeValue(e) {
    const { skus } = this.props.skus;
    this.setState({skuValue: e.currentTarget.textContent})
    this.props.callbackFromParent(skus.find((sku) => sku._id === e.currentTarget.id))
  }

  render() {
    const { skus } = this.props.skus;
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          {this.state.skuValue}
        </DropdownToggle>
        <DropdownMenu>
             {skus.map(({_id, name }) => (
                <DropdownItem key={_id} id={_id} onClick={this.changeValue}> {name} </DropdownItem>
            ))}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}


export default GoalsSKUDropdown;