import { combineReducers } from 'redux';
import ingReducer from './ingReducer';
import goalsReducer from './goalsReducer';

export default combineReducers({
  ing: ingReducer,
  goals: goalsReducer
});
