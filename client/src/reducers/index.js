import { combineReducers } from 'redux';
import ingReducer from './ingReducer';
<<<<<<< HEAD
import goalsReducer from './goalsReducer';

export default combineReducers({
  ing: ingReducer,
  goals: goalsReducer
});
=======
import authReducer from './authReducer';
import errorReducer from './errorReducer';

export default combineReducers({
  ing: ingReducer,
  auth: authReducer,
  errors: errorReducer
});
>>>>>>> 966a002b5dbf0536c164c9f0bf635ea75a3ca62a
