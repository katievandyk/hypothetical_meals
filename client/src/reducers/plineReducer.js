import {GET_PLINES, ADD_PLINE, UPDATE_PLINE, DELETE_PLINE, PLINES_LOADING} from '../actions/types';

const initialState = {
  plines: [],
  loading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_PLINES:
      return {
        ...state,
        plines: action.payload,
        loading: false
      }
    case PLINES_LOADING:
      return {
        ...state,
        loading: true
      }
    case ADD_PLINE:
      return {
        ...state,
        plines: [action.payload, state.plines]
      }
    case DELETE_PLINE:
      return {
        ...state,
        plines: state.ings.filter( pline => pline._id !== action.payload )
      }
    case UPDATE_PLINE:
      return {
        ...state,
        plines: [action.payload, state.plines]
      }
    default:
      return state;
  }

}
