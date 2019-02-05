import { GET_SKUS_BYPLINE, SKUS_LOADING, GET_SKUS,
ADD_SKU, DELETE_SKU, UPDATE_SKU, SKU_KW_SEARCH,
SKU_SORT, SKU_ING_FILTER, SKU_PLINE_FILTER, SKU_ERROR,
SKU_GROUP_BY_PL} from '../actions/types';

const initialState = {
  skus: [],
  loading: false,
  obj: {},
  sortby: 'name',
  sortdir: 'asc',
  error: '',
  count: 0,
  page: 1,
  pagelimit: 10,
  error_msgs: []

};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_SKUS_BYPLINE:
      return {
        ...state,
        skus: action.payload,
        loading: false,
      }
    case ADD_SKU:
      return {
        ...state
      }
    case DELETE_SKU:
      return {
        ...state,
        skus: state.skus.filter( sku => sku._id !== action.payload )
      }
    case UPDATE_SKU:{
      return {
        ...state
      }
    }
    case SKUS_LOADING:
      return {
        ...state,
        loading: true
      }
    case GET_SKUS:{
      if(state.obj.group_pl){
        delete state.obj.group_pl
      }
      return {
        ...state,
        skus: action.payload.results,
        count: action.payload.count,
        loading: false,
        pagelimit: 10,
        error_msgs: []
      }
    }
    case SKU_GROUP_BY_PL:{
      state.obj.group_pl = action.payload;
      return {
        ...state,
        obj: state.obj
      }
    }
    case SKU_KW_SEARCH:{
        state.obj.keywords = action.payload;
        return {
          ...state,
          obj: state.obj
        }
    }
    case SKU_ING_FILTER:{
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
    case SKU_PLINE_FILTER:{
      if(action.payload.length !== 0)
        state.obj.product_lines = action.payload;
      else {
        delete state.obj.product_lines;
      }
      return {
        ...state,
        obj: state.obj
      }
    }
    case SKU_SORT:{
      var page_val = action.payload.page;
      if(action.payload.pagelimit === -1){
        page_val = 1;
      }
      var sku_results = [];
      if(action.payload.data.count > 0 && (action.payload.data.results.length > 0 || Object.keys(action.payload.data.results).length > 0)){
        sku_results = action.payload.data.results;
      }
      return {
        ...state,
        skus: sku_results,
        count: action.payload.data.count,
        sortby: action.payload.sortby,
        sortdir: action.payload.sortdir,
        obj: action.payload.obj,
        loading: false,
        pagelimit: action.payload.pagelimit,
        page: page_val,
        error_msgs: []
      }
    }
    case SKU_ERROR:{
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
