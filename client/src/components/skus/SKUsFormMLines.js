import React from 'react';
import {
FormGroup, Input, Label, Row, Col, Button, FormFeedback
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLines } from '../../actions/linesActions';

class SKUsFormMLines extends React.Component {
  state={
    lines: [],
    validate: []
  };

  componentDidMount() {
    this.props.getLines();
    var tmpArray = [];
    var tmpVal = [];
    if(this.props.defaultValue){
      this.props.defaultValue.forEach(function (mLine) {
        if(mLine._id){
          tmpArray = [...tmpArray, {_id: mLine._id._id}]
          tmpVal = [...tmpVal, 'has-success'];
        }
      });
      this.setState({
        lines: tmpArray,
        validate: tmpVal
      });
    }
  }

  allValid = (validState=this.state.validate) => {
    var isValid = true;
    for(var i = 0; i < validState.length; i++){
      if(validState[i] !== 'has-success'){
         isValid = false;
       }
    }
    return isValid;
  }

  onChangeLine = (index, e) => {
    const newLines = this.state.lines;
    var newVal = this.state.validate;
    if(e.target.value.length > 0){
      var lineNotPresent = true;
      for(var i = 0; i < newLines.length; i ++){
        if(newLines[i]._id === e.target.value){
          lineNotPresent = false;
        }
      }
      if(lineNotPresent){
        newLines[index]._id = e.target.value;
        newVal[index] = 'has-success';
      }
      else{
        newVal[index] = 'already-selected'
      }
      this.setState({
        lines: newLines,
        validate: newVal
      });
    }
    else{
      newVal[index] = 'not-selected';
    }
    this.setState({
      validate: newVal
    });
    this.props.onLinesChange(this.state.lines, this.allValid());
    }


  addLine = () => {
    if(this.state.lines.length > 0) {
      this.setState({
        lines: [...this.state.lines, {_id:''}],
        validate: [...this.state.validate, '']
      });
    }
    else {
      this.setState({
        lines: [{_id:''}],
        validate: ['']
      });
    }
  }

  onDelEntry = (index) => {
    const reduced_lines = this.state.lines.filter((_,i)=> i !== index);
    const reduced_val = this.state.validate.filter((_,i)=> i !== index);
    this.setState({
      lines: reduced_lines,
      validate: reduced_val
    });
    this.props.onLinesChange(reduced_lines, this.allValid(reduced_val));
  }

  render() {
    var lines = this.state.lines;
    return(
      <div>
        <Row>
          <Col>
            <Label>Manufacturing Lines </Label>
          </Col>
        </Row>
        {lines.map(({_id}, index) => (
        <Row key={index}>
          <Col md={10}>
            <FormGroup>
              <Input
                valid={this.state.validate[index] === 'has-success'}
                invalid={this.state.validate[index]=== 'not-selected' || this.state.validate[index] === 'already-selected'}
                type="select"
                name="line"
                id="line"
                placeholder="Select the Manufacturing Line"
                onChange={this.onChangeLine.bind(this, index)}
                value={_id}>
                <option value=''>Select Manufacturing Line</option>
                {this.props.lines.lines.map(({_id, shortname }) => (
                <option key={_id} value={_id} name={shortname}>{shortname}</option>
              ))}
              </Input>
              {this.state.validate[index] === 'not-selected' ? (
                <FormFeedback>
                  Please select a valid manufacturing line from the dropdown.
                </FormFeedback>
              ):(
                <FormFeedback>
                  This manufacturing line has already been added. Please select a different manufacturing line from the dropdown.
                </FormFeedback>
              )}
            </FormGroup>
          </Col>
          <Col md={2}>
            <Button size="sm" color="link"
              id={_id._id}
              onClick={this.onDelEntry.bind(this, index)}
              style={{'color':'black'}}>
              <FontAwesomeIcon style={{verticalAlign:'bottom'}} icon = "times"/>
            </Button>
          </Col>
        </Row>
        ))}
        <Row>
          <Col style={{textAlign: 'center', paddingBottom: '1em'}}>
            <Button size="sm" onClick={this.addLine}>
              Add Another Manufacturing Line
            </Button>
          </Col>
        </Row>
      </div>
  );
  }
}


SKUsFormMLines.propTypes = {
  getLines: PropTypes.func.isRequired,
  lines: PropTypes.object.isRequired,
  onLinesChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.array
};

const mapStateToProps = state => ({
  lines: state.lines
});
export default connect(mapStateToProps, {getLines})(SKUsFormMLines);
