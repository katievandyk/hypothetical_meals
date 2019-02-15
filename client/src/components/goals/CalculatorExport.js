import React from 'react';
import { exportCalculator } from '../../actions/goalsActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

class CalculatorExport extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.export = this.export.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  export(e) {
    this.props.exportCalculator(this.props.goal)
  }



  render() {
    return (
      <div>
        <Button color="secondary" disabled={this.props.disableExport} onClick={this.export}>Export</Button>
      </div>
    );
  }
}

CalculatorExport.propTypes = {
  exportCalculator: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, { exportCalculator })(CalculatorExport);
