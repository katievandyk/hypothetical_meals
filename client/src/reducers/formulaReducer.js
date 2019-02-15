import {SORT_FORMULAS, ADD_FORMULA, UPDATE_FORMULA, DELETE_FORMULA,
  FORMULAS_LOADING, FORMULA_ERROR, FORMULA_KW_SEARCH, FORMULA_ING_FILTER,
  GET_FORMULA_SKUS, FORMULA_SKUS_LOADING
} from '../actions/types';

const initialState = {
  formulas: [],
  loading: false,
  page: 1,
  pagelimit:10,
  count: 0,
  error_msg: '',
  obj: {},
  sortby: 'name',
  sortdir: 'asc',
  formula_skus: [],
  formula_skus_loading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case SORT_FORMULAS:
      return {
        ...state,
        formulas: action.payload.data.results,
        count: action.payload.data.count,
        sortby: action.payload.sortby,
        sortdir: action.payload.sortdir,
        page: action.payload.page,
        pagelimit: action.payload.pagelimit,
        loading: false,
        error_msg: ''
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
         error_msg: action.payload.data.message,
         loading: false
       }
     }
     case FORMULA_KW_SEARCH:{
         state.obj.keywords = action.payload;
         return {
           ...state,
           obj: state.obj
         }
     }
     case FORMULA_ING_FILTER:{
       if(action.payload.length !== 0)
         state.obj.ingredients = action.payload;
       else {
         delete state.obj.ingredients;
       }
       return {
         ...state,
         obj: state.obj
       }
     }
     case GET_FORMULA_SKUS:
       return {
         ...state,
         formula_skus: action.payload,
         formula_skus_loading: false
       }
     case FORMULA_SKUS_LOADING:
       return {
         ...state,
         formula_skus_loading: true
       }
    default:
      return state;
  }

}
