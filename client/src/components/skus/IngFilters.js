import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sortIngs } from '../../actions/ingActions';
import { sortSKUs } from '../../actions/skuActions';
import Select from 'react-select'

class IngFilters extends React.Component {

  componentDidMount() {
    this.props.sortIngs('name', 'asc', 1, -1, {});
  }

  genOptions = (ings) => {
    var newOptions = [];
    ings.forEach(function(ing){
      var newOption = {value: ing._id, label: ing.name};
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  onChange = (e) => {
    var newIngFilters = [];
    e.forEach(function(option){
      newIngFilters = [...newIngFilters, option.value];
    });
    var newObj = this.props.skus.obj;
    if(e.length > 0){
      newObj['ingredients'] = newIngFilters;
    }
    else {
      delete newObj['ingredients'];
    }
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir, 1, this.props.skus.pagelimit, newObj);
  }

  render() {
    var ings = this.props.ing.ings;
    return (
      <div>Ingredient Filters:
        <Select isMulti={true} options={this.genOptions(ings)} onChange={this.onChange} />
      </div>
    );
  }
}

IngFilters.propTypes = {
  skus: PropTypes.object.isRequired,
  ing: PropTypes.object.isRequired,
  sortIngs: PropTypes.func.isRequired,
  sortSKUs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus,
  ing: state.ing
});
export default connect(mapStateToProps, {sortIngs, sortSKUs})(IngFilters);
