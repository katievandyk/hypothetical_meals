import { combineReducers } from 'redux';
import ingReducer from './ingReducer';
import goalsReducer from './goalsReducer';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import plineReducer from './plineReducer';
import skuReducer from './skuReducer';
import linesReducer from './linesReducer';
import importReducer from './importReducer';
import formulaReducer from './formulaReducer';
import scheduleReducer from './scheduleReducer';

export default combineReducers({
  ing: ingReducer,
  auth: authReducer,
  goals: goalsReducer,
  lines: linesReducer,
  errors: errorReducer,
  plines: plineReducer,
  schedule: scheduleReducer,
  skus: skuReducer,
  import: importReducer,
  formulas: formulaReducer
});
