import React from 'react';
import {
  InputGroup, InputGroupAddon, Input, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setSKUsLoading, searchSKUbyKW, sortSKUs } from '../../actions/skuActions';

class SKUsKeywordSearch extends React.Component {
  state = {
    keywords: ''
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    if(e.target.value.length === 0){
      this.props.setSKUsLoading();
      const newObj = {};
      if('ingredients' in this.props.skus.obj){
        newObj.ingredients = this.props.skus.obj.ingredients
      }
      if('product_lines' in this.props.skus.obj){
        newObj.product_lines = this.props.skus.obj.product_lines
      }
      this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir, newObj);
    };
  }

  searchKW = () => {
    this.props.setSKUsLoading();
    this.props.searchSKUbyKW(this.state.keywords);
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir, this.props.skus.obj);
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
SKUsKeywordSearch.propTypes = {
  setSKUsLoading: PropTypes.func.isRequired,
  searchSKUbyKW: PropTypes.func.isRequired,
  skus: PropTypes.object.isRequired
};

const mapStateToProps = state => ( {
  skus: state.skus
});

export default connect(mapStateToProps, {searchSKUbyKW, setSKUsLoading, sortSKUs})(SKUsKeywordSearch);
