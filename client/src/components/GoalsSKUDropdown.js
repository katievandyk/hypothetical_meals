import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import { getSKUsByPLine } from '../actions/skuActions';
import PropTypes from 'prop-types';

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
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} onClick={() => this.props.getSKUsByPLine(this.props.pline)}>
        <DropdownToggle caret>
          {this.state.skuValue}
        </DropdownToggle>
        <DropdownMenu>
             {skus.map(({_id, name }) => (
              <tr key={_id}>
                <DropdownItem id={_id} onClick={this.changeValue}> {name} </DropdownItem>
              </tr>
            ))}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

GoalsSKUDropdown.propTypes = {
  getSKUsByPLine: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  skus: state.skus
});

export default connect(mapStateToProps, { getSKUsByPLine })(GoalsSKUDropdown);