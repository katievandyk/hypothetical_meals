import { GET_SCHEDULE, SCHEDULE_LOADING, GET_GOAL_SKUS, ENABLE_GOAL, DISABLE_GOAL,
  ADD_ACTIVITY, UPDATE_ACTIVITY, SCHEDULE_ERROR} from '../actions/types';

const initialState = {
  schedule: {},
  goal_skus: [],
  loading: false,
  error_msgs: []
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_SCHEDULE:
      return {
        ...state,
        schedule: action.payload,
        loading: false,
        error_msgs: []
      }
    case SCHEDULE_LOADING:
      return {
        ...state,
        loading: true
      }
    case ADD_ACTIVITY:
      return {
        ...state,
        schedule: state.schedule.lines_list.find(entry => action.payload.line._id === entry.line._id).activities.push(action.payload),
        loading: false
     }
    case ENABLE_GOAL:
        state.schedule.enabled_goals.push(action.payload)
        return {
          ...state,
          schedule: state.schedule,
          loading: false
     }
    case DISABLE_GOAL:
        state.schedule.enabled_goals = state.schedule.enabled_goals.filter( goal => goal._id !== action.payload._id )
        return {
          ...state,
          schedule: state.schedule,
          loading: false
     }
    case GET_GOAL_SKUS:
        console.log(action.payload)
        return {
          ...state,
          goal_skus: action.payload,
          loading: false
     }
    case UPDATE_ACTIVITY:
        return {
          ...state,
     }
    case SCHEDULE_ERROR:{
      console.log(action.payload);
      return {
        ...state,
        error_msgs: [...state.error_msgs, action.payload.data.message],
        loading: false
      }
    }
    default:
      return state;
  }

}
