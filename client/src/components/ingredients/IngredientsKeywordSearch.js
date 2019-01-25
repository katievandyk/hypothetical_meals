import React from 'react';
import {
  InputGroup, InputGroupAddon, Input, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { setIngsLoading, searchIngbyKW } from '../../actions/ingActions';

class IngredientsKeywordSearch extends React.Component {
  state = {
    keywords: ''
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  searchKW = () => {
    this.props.setIngsLoading();
    console.log([this.state.keywords]);
    const keywords = {
      keywords: ['salt', 'honey']
    };
    this.props.searchIngbyKW(keywords);
  }
  render() {
    return (
      <div>
      <InputGroup>
        <Input placeholder="Keyword Search" name="keywords" onChange={this.onChange}/>
        <InputGroupAddon addonType="append"><Button onClick={this.searchKW}><FontAwesomeIcon icon = "search"/></Button></InputGroupAddon>
      </InputGroup>
      </div>
    );
  }
}

const mapStateToProps = state => ( {
  ing: state.ing
});

export default connect(mapStateToProps, {searchIngbyKW, setIngsLoading})(IngredientsKeywordSearch);
