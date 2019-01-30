import { GET_SKUS_BYPLINE, SKUS_LOADING, GET_SKUS, SKUS_INGQUANTITY} from '../actions/types';

const initialState = {
  skus: [],
  ing_quantities: [],
  loading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_SKUS_BYPLINE:
      return {
        ...state,
        skus: action.payload,
        loading: false
      }
    case SKUS_LOADING:
      return {
        ...state,
        loading: true
      }
    case GET_SKUS:
      return {
        ...state,
        skus: action.payload,
        loading: false
      }
    case SKUS_INGQUANTITY:
      return {
        ...state,
        ing_quantities: action.payload,
        loading: false
      }
    default:
      return state;
  }

}
