import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sortSKUs } from '../../actions/skuActions';
import { getPLines } from '../../actions/plineActions';
import Select from 'react-select';

class GoalsProductLineFilter extends React.Component {
  state={
    modal: false,
    pline_filters: {},
    selected_plines: {}
  }

  componentDidMount() {
    this.props.getPLines(1, -1);
  }

  genOptions = (plines) => {
    var newOptions = [];
    plines.forEach(function(pline){
      var newOption = {value: pline._id, label: pline.name};
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  onChange = (e) => {
    var newPlineFilters = [];
    e.forEach(function(option){
      newPlineFilters = [...newPlineFilters, option.value];
    });
    var newObj = this.props.skus.obj;
    if(e.length > 0){
      newObj['product_lines'] = newPlineFilters;
    }
    else {
      delete newObj['product_lines'];
    }
    this.props.sortSKUs(this.props.skus.sortby, this.props.skus.sortdir, 1, this.props.skus.pagelimit, newObj);
  }

  render() {
    var plines = [];
    if(this.props.plines.plines.length > 0){
      plines = this.props.plines.plines;
    }
    return (
      <div>Product Line Filters:  {'  '}
        <Select isMulti={true} options={this.genOptions(plines)} onChange={this.onChange} />
      </div>
    );
  }
}

GoalsProductLineFilter.propTypes = {
  plines: PropTypes.object.isRequired,
  skus: PropTypes.object.isRequired,
  getPLines: PropTypes.func.isRequired,
  sortSKUs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  plines: state.plines,
  skus: state.skus
});

export default connect(mapStateToProps, {sortSKUs, getPLines})(GoalsProductLineFilter);
