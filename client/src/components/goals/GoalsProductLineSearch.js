import React from 'react';
import {
  InputGroup, InputGroupAddon, Input, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { connect } from 'react-redux';
import { searchPLines } from '../../actions/plineActions';
import PropTypes from 'prop-types';


class GoalsProductLineSearch extends React.Component {
  constructor(props) {
    super(props);

    this.filterValues = this.filterValues.bind(this);
    this.state = {
      keywords: [],
    };
  }

  filterValues = e => {
    this.props.searchPLines({"keywords": this.state.keywords})
    this.props.callbackFromParent(this.props.plines.plines)
  }

  onChange = e => {
     this.setState({
       keywords: [e.target.value]
     });
   }

  render() {
    const { plines } = this.props.plines;
    return (
        <div>
          <InputGroup>
            <Input placeholder="Keyword Search" name="keywords" onChange={this.onChange}/>
            <InputGroupAddon addonType="append"><Button onClick={this.filterValues}><FontAwesomeIcon icon = "search"/></Button></InputGroupAddon>
          </InputGroup>
        </div>
    );
  }
}

GoalsProductLineSearch.propTypes = {
  searchPLines: PropTypes.func.isRequired,
  plines: PropTypes.object.isRequired,
  callbackFromParent: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  plines: state.plines
});

export default connect(mapStateToProps, { searchPLines })(GoalsProductLineSearch);