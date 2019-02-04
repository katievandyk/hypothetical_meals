import {GET_PLINES, ADD_PLINE, UPDATE_PLINE, DELETE_PLINE, PLINES_LOADING, SEARCH_PLINES} from '../actions/types';

const initialState = {
  plines: [],
  loading: false,
  page: 1,
  pagelimit:10,
  count: 0
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_PLINES:{
      var page_val = action.payload.page;
      if(action.payload.pagelimit === -1){
        page_val = 1;
      }
      return {
        ...state,
        plines: action.payload.data.results,
        count: action.payload.data.count,
        page: page_val,
        pagelimit: action.payload.pagelimit,
        loading: false
      }
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
    case SEARCH_PLINES:
      var pline_results = [];
      if( Object.keys(action.payload.results).length > 0){
        pline_results = action.payload.results;
      }
      return {
        ...state,
        plines: pline_results
      }
    default:
      return state;
  }

}
