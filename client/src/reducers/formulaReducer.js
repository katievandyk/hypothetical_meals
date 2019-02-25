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
  error_msgs: [],
  obj: {},
  sortby: 'name',
  sortdir: 'asc',
  formula_skus: [],
  formula_skus_loading: false,
  added_formula: {}
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
        obj: action.payload.obj,
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
        added_formula: action.payload,
        error_msgs: []
      }
    case DELETE_FORMULA:
      return {
        ...state,
        formulas: state.formulas.filter( formula => formula._id !== action.payload ),
        error_msgs: []
      }
    case UPDATE_FORMULA:
      return {
        ...state,
        error_msgs: []
      }
     case FORMULA_ERROR:{
       return {
         ...state,
         error_msgs: [...state.error_msgs, action.payload.data.message],
         loading: false,
         added_formula: {}
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
