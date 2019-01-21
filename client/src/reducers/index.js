import { combineReducers } from 'redux';
import ingReducer from './ingReducer';
import goalReducer from './goalReducer';

export default combineReducers({
  ing: ingReducer,
  goal: goalReducer
});
