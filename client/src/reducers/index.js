import { combineReducers } from 'redux';
import ingReducer from './ingReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';

export default combineReducers({
  ing: ingReducer,
  auth: authReducer,
  errors: errorReducer
});