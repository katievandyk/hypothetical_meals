import {GET_INGS, ADD_ING, DELETE_ING, INGS_LOADING} from '../actions/types';

const initialState = {
  ings: [],
  loading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_INGS:
      return {
        ...state,
        ings: action.payload,
        loading: false
      }
    case ADD_ING:
      return {
        ...state,
        ings: [action.payload, state.ings]
      }
    case DELETE_ING:
      return {
        ...state,
        ings: state.ings.filter( ing => ing._id !== action.payload )
      }
    case INGS_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state;
  }

}
