import { GET_SALES_SUMMARY, SALES_LOADING } from '../actions/types';

const initialState = {
  loading: false,
  summary: []
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_SALES_SUMMARY:
      return {
        ...state,
        summary: action.payload,
        loading: false,
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
