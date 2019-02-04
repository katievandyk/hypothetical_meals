import {UPLOAD_CHECK, UPLOAD_ERROR, IMPORT_OVERWRITES, SET_IMPORT_LOADING} from '../actions/types';

const initialState = {
  success: true,
  error_msgs: [],
  check_res: {},
  import_res: {},
  loading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case UPLOAD_CHECK:{
      return {
        ...state,
        success:true,
        check_res: action.payload,
        error_msgs: [],
        loading: false
      }
    }
    case UPLOAD_ERROR:{
      return {
        ...state,
        success: false,
        error_msgs: [...state.error_msgs, action.payload.data.message],
        loading: false
      }
    }
    case IMPORT_OVERWRITES:{
      return {
        ...state,
        success:true,
        import_res: action.payload,
        error_msgs: [],
        loading: false
      }
    }
    case SET_IMPORT_LOADING:{
      return {
        ...state,
        loading: true
      }
    }
    default:
      return state;
  }

}
