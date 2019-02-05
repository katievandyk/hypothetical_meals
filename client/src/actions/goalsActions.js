import axios from 'axios';
import { GET_GOALS, ADD_GOAL, GOALS_LOADING, GOALS_INGQUANTITY, GOAL_CALCULATOREXPORT, GOAL_EXPORT, GOAL_ERROR } from './types';

const FileDownload = require('js-file-download');

export const getGoals = (user_email) => dispatch =>  {
  dispatch(setGoalsLoading());
  axios.get('/api/manufacturing/' + user_email).then(res =>
    dispatch({
      type: GET_GOALS,
      payload: res.data
    })
  ).catch(error =>{
    dispatch({
      type: GOAL_ERROR,
      payload: error.response
    })
  });
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
  ).catch(error =>{
    dispatch({
      type: GOAL_ERROR,
      payload: error.response
    })
  });
};


export const addGoal = (goal) => dispatch =>  {
  axios.post('/api/manufacturing', goal).then(res =>
    dispatch({
      type: ADD_GOAL,
      payload: res.data
    })
  ).catch(error =>{
    dispatch({
      type: GOAL_ERROR,
      payload: error.response
    })
  });
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
