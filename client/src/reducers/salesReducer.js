import { GET_SALES_SUMMARY, SALES_LOADING, SALES_GET_SKUS_BY_PL } from '../actions/types';

const initialState = {
  loading: false,
  summary: [],
  pline_groups: {},
  summary_customers: []
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_SALES_SUMMARY:
      return {
        ...state,
        summary: action.payload,
        loading: false,
      }
    case SALES_GET_SKUS_BY_PL:
        return {
          ...state,
          pline_groups: action.payload
        }
    case SALES_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state;
  }

}
