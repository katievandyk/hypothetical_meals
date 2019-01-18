import { combineReducers } from 'redux';
import ingReducer from './ingReducer';

export default combineReducers({
  ing: ingReducer
});
