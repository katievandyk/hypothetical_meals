import React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { connect } from 'react-redux';
import { getPLines } from '../actions/plineActions';
import PropTypes from 'prop-types';


class GoalsProductLineDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.state = {
      plineValue: 'Product Line',
      dropdownOpen: false
    };
  }

  componentDidMount() {
      this.props.getPLines();
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  changeValue(e) {
    this.setState({plineValue: e.currentTarget.textContent})
    this.props.callbackFromParent(e.currentTarget.id)
  }

  render() {
    const { plines } = this.props.plines;
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          {this.state.plineValue}
        </DropdownToggle>
        <DropdownMenu>
             {plines.map(({_id, name }) => (
              <tr key={_id}>
                <DropdownItem id={_id} onClick={this.changeValue}> {name} </DropdownItem>
              </tr>
            ))}
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

GoalsProductLineDropdown.propTypes = {
  getPLines: PropTypes.func.isRequired,
  plines: PropTypes.object.isRequired,
  callbackFromParent: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  plines: state.plines
});

export default connect(mapStateToProps, { getPLines })(GoalsProductLineDropdown);