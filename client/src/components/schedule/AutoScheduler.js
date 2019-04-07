import React  from 'react'
import { Label, FormGroup, Row, Col, CustomInput, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { automate, bulkActivities, cancelActivities} from '../../actions/scheduleActions';
import moment from 'moment';

class AutoScheduler extends React.Component {

  state = {
    modal: false,
    unscheduled_modal: false,
    selectAllActivities: true,
    selected_activities: [],
    showAllActivities: false,
    validate_dates:'',
    valid_activities: '',
    inReview: false
  }

  componentDidMount() {
    if(Object.keys(this.props.schedule.autoschedule).length > 0){
      this.setState({
        inReview: true
      })
    }
  }

  modal_toggle = () => {
      this.setState({
        modal: !this.state.modal,
      });
  }

  unscheduled_toggle = () => {
      this.setState({
        unscheduled_modal: !this.state.unscheduled_modal
      });
  }

  selectAll = (e) => {
    this.setState({
      selectAllActivities: !this.state.selectAllActivities,
      selected_activities: []
    });
  }

  showAll = () => {
    this.setState({
      showAllActivities: !this.state.showAllActivities
    });
  }

  modifyActivities = (e, goal, sku) => {
     var activities_options = [];
     const goal_skus = this.props.schedule.goal_skus;
     const schedule_activities = this.props.schedule.activities;

     for(var i = 0; i < goal_skus.length; i++){
       for(var j = 0; j < goal_skus[i].skus.length; j++){
         const onschedule = schedule_activities.filter(({goal_id, sku}) => goal_id._id === goal_skus[i].goal._id && sku._id === goal_skus[i].skus[j]._id);
         if(onschedule.length === 0){
           activities_options = activities_options.concat({goal_id: goal_skus[i].goal._id, sku_id: goal_skus[i].skus[j]._id, duration: goal_skus[i].skus[j].duration});
         }
       }
     }
     var new_selected_activities = [];
     if(this.state.selectAllActivities){
        new_selected_activities = activities_options;
     }
     else if(this.state.selected_activities.length > 0){
       new_selected_activities = this.state.selected_activities;
     }

     if(e.target.checked){
       new_selected_activities = new_selected_activities.concat({goal_id: goal._id, sku_id: sku._id, duration: sku.duration});
     }
     else{
       new_selected_activities = new_selected_activities.filter(({goal_id, sku_id}) => (goal_id !== goal._id || sku_id !== sku._id));
     }
     var all_selected = (new_selected_activities.length === activities_options.length);
     this.setState({
       selected_activities: new_selected_activities,
       selectAllActivities: all_selected
     });
  }

  isSelected = (goal, sku) => {
    for(var i = 0; i < this.state.selected_activities.length; i++){
        if(this.state.selected_activities[i].goal_id === goal._id && this.state.selected_activities[i].sku_id === sku._id)
          return true;
    }
    return false;
  }

  onSubmit = () => {
    var allRequiredFields= true;
    var activities = this.state.selected_activities;
    if(this.state.selected_activities.length === 0){
      if(!this.state.selectAllActivities) {
        alert("Please select at least one activity.")
      }
      else {
        const goal_skus = this.props.schedule.goal_skus;
        const schedule_activities = this.props.schedule.activities;
        for(var i = 0; i < goal_skus.length; i++){
          for(var j = 0; j < goal_skus[i].skus.length; j++){
            const onschedule = schedule_activities.filter(({goal_id, sku}) => goal_id._id === goal_skus[i].goal._id && sku._id === goal_skus[i].skus[j]._id);
            if(onschedule.length === 0){
              activities = activities.concat({goal_id: goal_skus[i].goal._id, sku_id: goal_skus[i].skus[j]._id, duration: goal_skus[i].skus[j].duration});
            }
          }
        }
      }
    }
    if(!this.state.startDate || !this.state.endDate){
      this.setState({
        validate_dates: 'not-selected'
      })
      allRequiredFields = false;
    }
    else {
      const startDate = this.state.startDate.format('MM-DD-YYYY');
      const endDate = this.state.endDate.format('MM-DD-YYYY');
      this.props.automate(activities, this.props.auth.user.id, startDate, endDate);
      this.setState({
        inReview: true,
        selectAllActivities: true,
        selected_activities: [],
        showAllActivities: false,
        startDate: null,
        endDate: null
      });
      this.modal_toggle();
      this.unscheduled_toggle();
    }
  }

  approveActivities = () => {
    this.props.bulkActivities(this.props.schedule.autoschedule);
    this.setState({
      inReview: false,
      modal:false,
      selectAllActivities: true,
      selected_activities: [],
      showAllActivities: false,
      startDate: null,
      endDate: null
    })
  }

  cancelActivities = () => {
    this.props.cancelActivities();
    this.setState({
      inReview: false,
      modal: false,
      selectAllActivities: true,
      selected_activities: [],
      showAllActivities: false,
      startDate: null,
      endDate: null
    })
  }

  goal_skus_input = (goal, sku_id) => {
    const schedule_activities = this.props.schedule.activities;
    const onschedule = schedule_activities.filter(({goal_id, sku}) => goal_id._id === goal._id && sku._id === sku_id._id);
    if(onschedule.length === 0){
      return(<CustomInput key={goal._id + '' + sku_id._id} type="checkbox" id={goal._id + sku_id._id} label={goal.name + ": " + sku_id.name}
        checked={this.state.selectAllActivities || this.isSelected(goal, sku_id)} onChange={e => this.modifyActivities(e, goal, sku_id)}/>);
    }
    else{
      return '';
    }
  }

  render() {
    var goal_skus = this.props.schedule.goal_skus;
    var autoschedule = this.props.schedule.autoschedule;

    if(this.state.inReview && Object.keys(autoschedule).length > 1){
      return (
      <div>
        <div style={{paddingBottom: '1em'}}>
          <Button style={{width:'100%'}}color="primary" onClick={this.approveActivities}>Approve Pending Activities</Button>
        </div>
      <div>
          <Button style={{width:'100%'}}color="danger" onClick={this.cancelActivities}>Cancel Pending Activities</Button>
        </div>

        <Modal isOpen={this.state.unscheduled_modal} toggle={this.unscheduled_toggle}>
          <ModalHeader>{autoschedule.unscheduled && autoschedule.unscheduled.length > 0 ?(<div>Could not schedule all activities</div>):(<div>All Activities Scheduled!</div>)}</ModalHeader>
          <ModalBody>{autoschedule.unscheduled && autoschedule.unscheduled.length > 0 ?(
              <div>
                The following activities were not scheduled.
                <ol>
                {autoschedule.unscheduled.map(({goal_id, sku_id}) => (
                  <li key={goal_id._id + sku_id._id}>{goal_id.name + ": " + sku_id.name}</li>
                ))}
                </ol>
              </div>
            ):(
              <div> Review the schedule of activities (in blue) on the timeline. Accept or Reject the schedule generated by the autoscheduler by clicking the corresponding buttons on the left.</div>
            )}
          </ModalBody>
          <ModalFooter><Button color="success" onClick={this.unscheduled_toggle}>OK</Button></ModalFooter>
        </Modal>
      </div>)

    }
    else {
    return (
      <div>
        <Button style={{width:'100%'}}color="success" onClick={this.modal_toggle}>Auto-schedule Activities</Button>
        <Modal isOpen={this.state.modal} toggle={this.modal_toggle}>
          <ModalHeader>Automatically Schedule Activities</ModalHeader>
          <ModalBody>
          <FormGroup>
              <Label><h5>1. Select unscheduled activities.</h5></Label>
                <div style={{paddingBottom: '1.5em'}}>
                      <Row>
                          <Col md={3}>
                            <CustomInput id={0} type="checkbox" label={'Select All'}
                             checked={this.state.selectAllActivities} onChange={e => this.selectAll(e)}/>
                          </Col>
                          <Col md={6} style={{paddingLeft: '0em'}}>
                            <Button onClick={this.showAll} color="link" size="sm">
                              {this.state.showAllActivities ? ('(Hide All)'):('(Edit Selection/View All)')}
                            </Button>
                           </Col>
                      </Row>
                {this.state.showAllActivities &&
                   <div style={{marginLeft: '20px'}}>
                     {goal_skus.map(({goal, skus}) => skus.map((sku) =>
                     this.goal_skus_input(goal, sku)
                   ))
                     }
                   </div>}
                </div>
          </FormGroup>
          <FormGroup className="isInvalid">
            <Label for="date_range"><h5>2. Date Range</h5></Label>
            <div>
            <DateRangePicker
            startDate={this.state.startDate}
            startDateId="start_date_id"
            isOutsideRange={() => false}
            endDate={this.state.endDate} // momentPropTypes.momentObj or null,
            endDateId="end_date_id" // PropTypes.string.isRequired,
            onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
            focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
            onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired
            /></div>
            <div style={{display:'block'}} className={(this.state.validate_dates === 'not-selected')? ("invalid-feedback"):("hidden")}>
              Please enter valid dates.
            </div>
          </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.onSubmit}>Auto-Schedule</Button>{' '}
            <Button color="secondary" onClick={this.modal_toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.unscheduled_modal} toggle={this.unscheduled_toggle}>
          <ModalHeader>{autoschedule.unscheduled && autoschedule.unscheduled.length > 0 ?(<div>Could not schedule all activities</div>):(<div>All Activities Scheduled!</div>)}</ModalHeader>
          <ModalBody>{autoschedule.unscheduled && autoschedule.unscheduled.length > 0 ?(
              <div>
                The following activities were not scheduled.
                <ol>
                {autoschedule.unscheduled.map(({goal_id, sku_id}) => (
                  <li key={goal_id._id +''+ sku_id._id}>{goal_id.name + ": " + sku_id.name}</li>
                ))}
                </ol>
              </div>
            ):(
              <div> Review the schedule of activities (in blue) on the timeline. Accept or Reject the schedule generated by the autoscheduler by clicking the corresponding buttons on the left.</div>
            )}
          </ModalBody>
          <ModalFooter><Button color="success" onClick={this.unscheduled_toggle}>OK</Button></ModalFooter>
        </Modal>
      </div>
      )
    }
  }
}

AutoScheduler.propTypes = {
  schedule: PropTypes.object.isRequired,
  goals: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  lines: PropTypes.object.isRequired,
  automate: PropTypes.func.isRequired,
  bulkActivities: PropTypes.func.isRequired,
  cancelActivities: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  goals: state.goals,
  schedule: state.schedule,
  auth: state.auth,
  lines: state.lines
});

export default connect(mapStateToProps, {automate, bulkActivities, cancelActivities})(AutoScheduler);
