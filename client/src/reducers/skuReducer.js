import { GET_SKUS_BYPLINE, SKUS_LOADING, GET_SKUS} from '../actions/types';

const initialState = {
  skus: [],
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
    default:
      return state;
  }

}
