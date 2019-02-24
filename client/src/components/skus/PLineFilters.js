import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getPLines } from '../../actions/plineActions';
import { sortSKUs } from '../../actions/skuActions';
import Select from 'react-select'

class PLineFilters extends React.Component {

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
    var plines = this.props.plines.plines;
    return (
      <div>Product Line Filters:
        <Select isMulti={true} options={this.genOptions(plines)} onChange={this.onChange} />
      </div>
    );
  }
}

PLineFilters.propTypes = {
  skus: PropTypes.object.isRequired,
  plines: PropTypes.object.isRequired,
  getPLines: PropTypes.func.isRequired,
  sortSKUs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  skus: state.skus,
  plines: state.plines
});
export default connect(mapStateToProps, {getPLines, sortSKUs})(PLineFilters);
