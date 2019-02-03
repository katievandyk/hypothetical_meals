import {UPLOAD_CHECK, UPLOAD_ERROR, IMPORT_OVERWRITES} from '../actions/types';

const initialState = {
  success: true,
  error_msgs: [],
  check_res: {},
  import_res: {}
};

export default function(state = initialState, action) {
  switch(action.type) {
    case UPLOAD_CHECK:{
      return {
        ...state,
        success:true,
        check_res: action.payload
      }
    }
    case UPLOAD_ERROR:{
      return {
        ...state,
        success: false,
        error_msgs: [...state.error_msgs, action.payload.data.message]
      }
    }
    case IMPORT_OVERWRITES:{
      console.log(action.payload);
      return {
        ...state,
        success:true,
        import_res: action.payload
      }
    }
    default:
      return state;
  }

}
