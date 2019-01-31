import axios from 'axios';
import { GET_GOALS, ADD_GOAL, DELETE_GOAL, GOALS_LOADING, GOALS_INGQUANTITY, GOAL_CALCULATOREXPORT, GOAL_EXPORT } from './types';

const FileDownload = require('js-file-download');

export const getGoals = () => dispatch =>  {
  dispatch(setGoalsLoading());
  axios.get('/api/manufacturing').then(res =>
    dispatch({
      type: GET_GOALS,
      payload: res.data
    })
  );
};

export const setGoalsLoading = () => {
  return {
    type: GOALS_LOADING
  };
};

export const getGoalsIngQuantity = (goal) => dispatch =>  {
  dispatch(setGoalsLoading());
   axios.get('/api/manufacturing/ingquantities/' + goal).then(res =>
    dispatch({
      type: GOALS_INGQUANTITY,
      payload: res.data
    })
  );
};


export const addGoal = (goal) => dispatch =>  {
  axios.post('/api/manufacturing', goal).then(res =>
    dispatch({
      type: ADD_GOAL,
      payload: res.data
    })
  );
};


export const exportGoal = (goal) => dispatch => {
  dispatch(setGoalsLoading());
    axios.get('/api/manufacturing/export/' + goal._id).then(res => {
      FileDownload(res.data, goal.name + '.csv')
   });
    return {
        type: GOAL_EXPORT
    };
 };

 export const exportCalculator = (goal) => dispatch => {
   dispatch(setGoalsLoading());
     axios.get('/api/manufacturing/exportcalculator/' + goal._id).then(res => {
       FileDownload(res.data, goal.name + '_calc.csv')
    });
    return {
        type: GOAL_CALCULATOREXPORT
    };
  };