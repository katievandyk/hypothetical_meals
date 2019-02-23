import {GET_GOALS, ADD_GOAL, UPDATE_GOAL, DELETE_GOAL, GOALS_LOADING, GOALS_INGQUANTITY, GOAL_EXPORT, GOAL_CALCULATOREXPORT, GOAL_ERROR} from '../actions/types';

const initialState = {
   goals: [],
   ing_quantities: [],
   loading: false,
   error_msgs: []
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_GOALS:
      return {
        ...state,
        goals: action.payload,
        loading: false,
        error_msgs: []
      }
    case GOALS_LOADING:
      return {
        ...state,
        loading: true
      }
    case ADD_GOAL:
      return {
        ...state,
        goals: [...state.goals, action.payload],
        error_msgs: []
      }
    case DELETE_GOAL:
      return {
        ...state,
        goals: state.goals.filter( goal => goal._id !== action.payload ),
        error_msgs: []
      }
    case UPDATE_GOAL:{
      return {
        ...state,
        error_msgs: []
      }
    }
    case GOALS_INGQUANTITY:
      return {
        ...state,
        ing_quantities: action.payload,
        loading: false
      }
     case GOAL_EXPORT:
       return {
         ...state,
         loading: false,
         error_msgs: []
       }
     case GOAL_CALCULATOREXPORT:
       return {
         ...state,
         loading: false,
         error_msgs: []
       }
    case GOAL_ERROR:{
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
