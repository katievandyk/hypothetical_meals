import {GET_PLINES, ADD_PLINE, DELETE_PLINE, PLINES_LOADING} from '../actions/types';

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
    default:
      return state;
  }

}
