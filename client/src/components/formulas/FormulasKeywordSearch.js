import React from 'react';
import {
  InputGroup, InputGroupAddon, Input, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setFormulasLoading, searchFormulasByKW, sortFormulas } from '../../actions/formulaActions';

class FormulasKeywordSearch extends React.Component {
  state = {
    keywords: ''
  }
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    if(e.target.value.length === 0){
      this.props.setFormulasLoading();
      const newObj = {};
      if('skus' in this.props.formulas.obj){
        newObj.ingredients = this.props.formulas.obj.ingredients
      }
      this.props.sortFormulas(this.props.formulas.sortby, this.props.formulas.sortdir, 1, this.props.formulas.pagelimit, newObj);
    };
  }

  searchKW = () => {
    this.props.setFormulasLoading();
    this.props.searchFormulasByKW(this.state.keywords);
    this.props.sortFormulas(this.props.formulas.sortby, this.props.formulas.sortdir, 1, this.props.formulas.pagelimit, this.props.formulas.obj);
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
FormulasKeywordSearch.propTypes = {
  setFormulasLoading: PropTypes.func.isRequired,
  sortFormulas: PropTypes.func.isRequired,
  searchFormulasByKW: PropTypes.func.isRequired,
  formulas: PropTypes.object.isRequired
};

const mapStateToProps = state => ( {
  formulas: state.formulas
});

export default connect(mapStateToProps, {searchFormulasByKW, setFormulasLoading, sortFormulas})(FormulasKeywordSearch);
