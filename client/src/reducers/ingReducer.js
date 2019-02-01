import {GET_INGS, ADD_ING, DELETE_ING, UPDATE_ING,
  GET_ING_SKUS, INGS_LOADING, ING_SKUS_LOADING,
  ING_KW_SEARCH, ING_SORT, ING_SKU_FILTER} from '../actions/types';

const initialState = {
  ings: [],
  loading: false,
  ing_skus: [],
  ing_skus_loading: false,
  obj: {},
  sortby: 'name',
  sortdir: 'asc',
  page: 1,
  pagelimit: 10,
  count: 0
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_INGS:{
      return {
        ...state,
        ings: action.payload.results,
        count: action.payload.count,
        loading: false
      }}
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
    case UPDATE_ING:
      return {
        ...state,
        ings: [action.payload, state.ings]
      }
    case GET_ING_SKUS:
      return {
        ...state,
        ing_skus: action.payload,
        ing_skus_loading: false
      }
    case ING_SKUS_LOADING:
      return {
        ...state,
        ing_skus_loading: true
      }
    case ING_KW_SEARCH:{
        state.obj.keywords = action.payload;
        return {
          ...state,
          obj: state.obj
        }
    }
    case ING_SKU_FILTER:{
      if(action.payload.length !== 0)
        state.obj.skus = action.payload;
      else {
        delete state.obj.skus;
      }
      return {
        ...state,
        obj: state.obj
      }
    }
    case ING_SORT:
      return {
        ...state,
        ings: action.payload.data.results,
        sortby: action.payload.sortby,
        sortdir: action.payload.sortdir,
        obj: action.payload.obj,
        count: action.payload.data.count,
        page: action.payload.page,
        loading: false
      }
    default:
      return state;
  }

}
