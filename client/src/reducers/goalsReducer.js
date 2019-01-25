import {GET_GOALS, ADD_GOAL, DELETE_GOAL, GOALS_LOADING} from '../actions/types';

const initialState = {
   goals: [],
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
    default:
      return state;
  }

}
