import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sortSKUs } from '../../actions/skuActions';
import { sortIngs } from '../../actions/ingActions';
import Select from 'react-select';

class SKUFilters extends React.Component {

  componentDidMount() {
    this.props.sortSKUs('name', 'asc', 1, -1, {});
  }

  genOptions = (skus) => {
    var newOptions = [];
    skus.forEach(function(sku){
      var newOption = {value: sku._id, label: sku.name+": " + sku.unit_size + " * " + sku.count_per_case  + " (SKU#: " + sku.number +")"};
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  onChange = (e) => {
    var newSKUFilters = [];
    e.forEach(function(option){
      newSKUFilters = [...newSKUFilters, option.value];
    });
    var newObj = this.props.ing.obj;
    if(e.length > 0){
      newObj['skus'] = newSKUFilters;
    }
    else {
      delete newObj['skus'];
    }
    this.props.sortIngs(this.props.ing.sortby, this.props.ing.sortdir, 1, this.props.ing.pagelimit, newObj);
  }


  render() {
    var skus = this.props.skus.skus;
    return (
      <div>SKU Filters:
        <Select isMulti={true} options={this.genOptions(skus)} onChange={this.onChange} />
      </div>
    );
  }
}

SKUFilters.propTypes = {
  skus: PropTypes.object.isRequired,
  ing: PropTypes.object.isRequired,
  sortSKUs: PropTypes.func.isRequired,
  sortIngs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus,
  ing: state.ing
});
export default connect(mapStateToProps, {sortSKUs, sortIngs})(SKUFilters);
