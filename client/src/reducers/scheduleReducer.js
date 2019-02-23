import { GET_SCHEDULE, SCHEDULE_LOADING, GET_GOAL_SKUS, ENABLE_GOAL, DISABLE_GOAL,
  ADD_ACTIVITY, UPDATE_ACTIVITY, SCHEDULE_ERROR} from '../actions/types';

const initialState = {
  schedule: {},
  activities: [],
  goal_skus: [],
  loading: false,
  error_msg: ''
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_SCHEDULE:
      return {
        ...state,
        schedule: action.payload,
        loading: false,
        error_msg: ''
      }
    case SCHEDULE_LOADING:
      return {
        ...state,
        loading: true
      }
    case ADD_ACTIVITY:
      return {
        ...state,
        activities: [...state.activities, action.payload]
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
      console.log("ERROR");
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
