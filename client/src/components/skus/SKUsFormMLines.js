import React from 'react';
import {
FormGroup, Label, Row, Col, Button
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getLines } from '../../actions/linesActions';
import Select from 'react-select';

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

  onChangeLine = (index) => e => {
    const newLines = this.state.lines;
    var newVal = this.state.validate;
    if(e.value.length > 0){
      var lineNotPresent = true;
      for(var i = 0; i < newLines.length; i ++){
        if(newLines[i]._id === e.value){
          lineNotPresent = false;
        }
      }
      if(lineNotPresent){
        newLines[index]._id = e.value;
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
    this.props.onLinesChange(newLines, this.allValid());
  }


  addLine = () => {
    if(this.state.lines.length > 0) {
      this.setState({
        lines: [...this.state.lines, {_id:''}],
        validate: [...this.state.validate, 'not-selected']
      });
    }
    else {
      this.setState({
        lines: [{_id:''}],
        validate: ['not-selected']
      });
    }
    this.props.onLinesChange(this.state.lines, false)
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

  classNameValue = (index) => {
    if(this.state.validate[index] === 'already-selected' || (this.state.validate[index] === 'not-selected' && this.props.validate === 'not-selected')){
      return "isInvalid";
    }
    else if(this.state.validate[index] === 'has-success'){
      return "isValid";
    }
    else
      return "";
  }

  genOptions = (lines) => {
    var newOptions = [];
    lines.forEach(function(line){
      var newOption = {value: line._id, label: line.shortname};
      newOptions = [...newOptions, newOption];
    });
    return newOptions;
  }

  getDefaultValue = (id) => {
    if(id.length > 0){
      const [line] = this.props.lines.lines.filter(({_id})=> _id === id);
      if(line){
        return {value: id, label: line.shortname};
      }
      else {
        return '';
      }
    }
    else{
      return '';
    }

  }

  render() {
    var lines = this.state.lines;
    var validate = this.props.validate;
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
              <Select
                className={this.classNameValue(index)}
                classNamePrefix="react-select"
                options={this.genOptions(this.props.lines.lines)}
                onChange={this.onChangeLine(index)}
                placeholder="Select Manufacturing Line"
                value={this.getDefaultValue(_id)}/>
              <div style={{display:'block'}} className={(validate === 'not-selected' && this.state.validate[index] === 'not-selected')? ("invalid-feedback"):("hidden")}>
                Please select a valid manufacturing line from the dropdown.
              </div>
              <div style={{display:'block'}} className={(this.state.validate[index] === 'already-selected')? ("invalid-feedback"):("hidden")}>
                This manufacturing line has already been added. Please select a different manufacturing line from the dropdown.
              </div>
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
  defaultValue: PropTypes.array,
  validate: PropTypes.string
};

const mapStateToProps = state => ({
  lines: state.lines
});
export default connect(mapStateToProps, {getLines})(SKUsFormMLines);
