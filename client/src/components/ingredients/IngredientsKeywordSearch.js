import React from 'react';
import {
  InputGroup, InputGroupAddon, Input, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setIngsLoading, searchIngbyKW, sortIngs } from '../../actions/ingActions';

class IngredientsKeywordSearch extends React.Component {
  state = {
    keywords: ''
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    if(e.target.value.length === 0){
      this.props.setIngsLoading();
      const newObj = {};
      if('skus' in this.props.ing.obj){
        newObj.skus = this.props.ing.obj.skus
      }
      this.props.sortIngs(this.props.ing.sortby, this.props.ing.sortdir, newObj);
    };
  }

  searchKW = () => {
    this.props.setIngsLoading();
    this.props.searchIngbyKW(this.state.keywords);
    this.props.sortIngs(this.props.ing.sortby, this.props.ing.sortdir, this.props.ing.obj);
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
IngredientsKeywordSearch.propTypes = {
  setIngsLoading: PropTypes.func.isRequired,
  searchIngbyKW: PropTypes.func.isRequired,
  ing: PropTypes.object.isRequired
};

const mapStateToProps = state => ( {
  ing: state.ing
});

export default connect(mapStateToProps, {searchIngbyKW, setIngsLoading, sortIngs})(IngredientsKeywordSearch);
