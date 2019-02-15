import {GET_PLINES, ADD_PLINE, UPDATE_PLINE, DELETE_PLINE, PLINES_LOADING, PLINE_ERROR} from '../actions/types';

const initialState = {
  plines: [],
  loading: false,
  page: 1,
  pagelimit:10,
  count: 0,
  error_msg: ''
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_PLINES:
      return {
        ...state,
        plines: action.payload.data.results,
        count: action.payload.data.count,
        page: action.payload.page,
        pagelimit: action.payload.pagelimit,
        loading: false,
        error_msg: ''
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
        plines: state.plines.filter( pline => pline._id !== action.payload )
      }
    case UPDATE_PLINE:
      return {
        ...state,
        plines: [action.payload, state.plines]
      }
     case PLINE_ERROR:{
       console.log(action.payload);
       return {
         ...state,
         error_msg: action.payload.data.message,
         loading: false
       }
     }
    default:
      return state;
  }

}
