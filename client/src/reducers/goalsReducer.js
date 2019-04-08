import {GET_GOALS, GET_ALL_GOALS, ADD_GOAL, UPDATE_GOAL, DELETE_GOAL, GOALS_LOADING, GOALS_INGQUANTITY, GOAL_EXPORT, GOAL_CALCULATOREXPORT,
  GOAL_ERROR, SCHEDULE_KW_SEARCH, SKU_PROJECTION, GOALS_SORT, ENABLE_GOAL } from '../actions/types';

const initialState = {
   goals: [],
   all_goals: [],
   ing_quantities: [],
   sku_projection: [],
   loading: false,
   error_msgs: [],
   sortby: 'name',
   sortdir: 'asc'
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
    case GET_ALL_GOALS:
      return {
        ...state,
        all_goals: action.payload,
        loading: false,
        error_msgs: []
      }
    case GOALS_SORT:
      return {
        ...state,
        goals: action.payload.data,
        sortby: action.payload.sortby,
        sortdir: action.payload.sortdir,
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
    case ENABLE_GOAL:{
      return {
        ...state,
        goals: state.goals.map(goal => (goal._id === action.payload._id) ? action.payload : goal),
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
    case SCHEDULE_KW_SEARCH:{
      return {
        ...state,
        goals: action.payload,
        error_msgs: []
      }
    }
    case SKU_PROJECTION: {
        return {
         ...state,
         sku_projection: action.payload,
         error_msgs: [],
         loading: false
        }
    }
    default:
      return state;
  }

}
