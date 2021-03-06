import { GET_SCHEDULE, SCHEDULE_LOADING, GET_GOAL_SKUS, DISABLE_GOAL,
  ADD_ACTIVITY, GET_ACTIVITY, UPDATE_ACTIVITY, DELETE_ACTIVITY, SCHEDULE_ERROR,
  SCHEDULE_REPORT, SCHEDULE_WARNING, AUTOSCHEDULE, BULK_ACTIVITIES, CANCEL_ACTIVITIES} from '../actions/types';

const initialState = {
  schedule: {},
  activities: [],
  goal_skus: [],
  loading: false,
  error_msgs: [],
  obj: {},
  goals: [],
  warning_msgs: [],
  autoschedule: {},
  report: {}
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
    case GET_ACTIVITY:
        return {
          ...state,
          error_msgs: [],
          activities: action.payload
     }
     case AUTOSCHEDULE:{
       return {
         ...state,
         error_msgs: [],
         autoschedule: action.payload
      }
    }
    case BULK_ACTIVITIES:{
      return {
        ...state,
        error_msgs: [],
        autoschedule: {}
     }
   }
   case CANCEL_ACTIVITIES:{
     return {
       ...state,
       error_msgs: [],
       autoschedule: {}
    }
  }
    case ADD_ACTIVITY:
      return {
        ...state,
        error_msgs: [],
        activities: [...state.activities, action.payload]
     }
    case UPDATE_ACTIVITY:
        return {
          ...state,
          error_msgs: []
     }
     case DELETE_ACTIVITY:
        return {
          ...state,
          error_msgs: [],
          activities: state.activities.filter( act => act._id !== action.payload)
     }
    case DISABLE_GOAL:
        state.schedule.enabled_goals = state.schedule.enabled_goals.filter( goal => goal._id !== action.payload.goal_id )
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
    case SCHEDULE_REPORT:{
      return {
        ...state,
        report: action.payload,
        error_msgs:[]
      }
    }
    case SCHEDULE_ERROR:{
      console.log("ERROR");
      return {
        ...state,
        error_msgs: [...state.error_msgs, action.payload.data.message],
        loading: false,
        warning_msgs: []
      }
    }
    case SCHEDULE_WARNING:{
      return {
        ...state,
        loading: false,
        warning_msgs: action.payload
      }
    }

    default:
      return state;
  }


}
