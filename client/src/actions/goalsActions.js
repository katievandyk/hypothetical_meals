import axios from 'axios';
import { GET_GOALS, ADD_GOAL, DELETE_GOAL, GOALS_LOADING } from './types';

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

export const addGoal = () => dispatch =>  {
  axios.post('/api/manufacturing').then(res =>
    dispatch({
      type: ADD_GOAL,
      payload: res.data
    })
  );
};
