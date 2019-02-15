import {UPLOAD_CHECK, UPLOAD_ERROR, RESET_IMPORT_STATE, IMPORT_OVERWRITES, SET_IMPORT_LOADING} from '../actions/types';

const initialState = {
  success: true,
  error_msg: '',
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
        error_msg: '',
        loading: false
      }
    }
    case UPLOAD_ERROR:{
      return {
        ...state,
        success: false,
        error_msg: action.payload.data.message,
        loading: false
      }
    }
    case IMPORT_OVERWRITES:{
      return {
        ...state,
        success:true,
        import_res: action.payload,
        error_msg: '',
        loading: false
      }
    }
    case SET_IMPORT_LOADING:{
      return {
        ...state,
        loading: true
      }
    }
    case RESET_IMPORT_STATE:{
      return initialState;
    }
    default:
      return state;
  }

}
