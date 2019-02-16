import {GET_LINES, ADD_LINE, UPDATE_LINE, DELETE_LINE, LINES_LOADING, LINE_ERROR} from '../actions/types';

const initialState = {
   lines: [],
   loading: false,
   error_msgs: []
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_LINES:
      return {
        ...state,
        lines: action.payload,
        loading: false,
        error_msgs: []
      }
    case LINES_LOADING:
      return {
        ...state,
        loading: true
      }
    case ADD_LINE:
      return {
        ...state,
        lines: [...state.lines, action.payload]
      }
    case DELETE_LINE:
      return {
        ...state,
        lines: state.lines.filter( line => line._id !== action.payload )
      }
    case UPDATE_LINE:{
      return {
        ...state
      }
    }
    case LINE_ERROR:{
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
