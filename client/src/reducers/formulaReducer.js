import {SORT_FORMULAS, ADD_FORMULA, UPDATE_FORMULA, DELETE_FORMULA, FORMULAS_LOADING, FORMULA_ERROR} from '../actions/types';

const initialState = {
  formulas: [],
  loading: false,
  page: 1,
  pagelimit:10,
  count: 0,
  error_msgs: [],
  obj: {},
  sortby: 'name',
  sortdir: 'asc'
};

export default function(state = initialState, action) {
  switch(action.type) {
    case SORT_FORMULAS:
      return {
        ...state,
        formulas: action.payload.data.results,
        count: action.payload.data.count,
        page: action.payload.page,
        pagelimit: action.payload.pagelimit,
        loading: false,
        error_msgs: []
      }
    case FORMULAS_LOADING:
      return {
        ...state,
        loading: true
      }
    case ADD_FORMULA:
      return {
        ...state,
        plines: [action.payload, state.plines]
      }
    case DELETE_FORMULA:
      return {
        ...state,
        plines: state.plines.filter( pline => pline._id !== action.payload )
      }
    case UPDATE_FORMULA:
      return {
        ...state,
        plines: [action.payload, state.plines]
      }
     case FORMULA_ERROR:{
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
