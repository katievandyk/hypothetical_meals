import {GET_GOALS, ADD_GOAL, DELETE_GOAL, GOALS_LOADING, GOALS_INGQUANTITY, GOAL_EXPORT} from '../actions/types';

const initialState = {
   goals: [],
   ing_quantities: [],
   loading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_GOALS:
      return {
        ...state,
        goals: action.payload,
        loading: false
      }
    case GOALS_LOADING:
      return {
        ...state,
        loading: true
      }
    case ADD_GOAL:
      return {
        ...state,
        goals: [...state.goals, action.payload]
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
         loading: false
       }
    default:
      return state;
  }

}
