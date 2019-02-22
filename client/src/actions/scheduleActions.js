import axios from 'axios';
import { GET_SCHEDULE, SCHEDULE_LOADING, GET_GOAL_SKUS, ENABLE_GOAL, DISABLE_GOAL,
  ADD_ACTIVITY, UPDATE_ACTIVITY, SCHEDULE_ERROR} from './types';

export const getSchedule = () => dispatch =>  {
  dispatch(setScheduleLoading());
  axios.get(`/api/manufacturingschedule`).then(res =>
    dispatch({
      type: GET_SCHEDULE
    })
  ).catch(error =>{
    dispatch({
      type: SCHEDULE_ERROR,
      payload: error.response
    })
  });
};

export const setScheduleLoading = () => {
  return {
    type: SCHEDULE_LOADING
  };
};

export const getGoalSKUs = (goal_id) => dispatch => {
  axios.get(`/api/manufacturingschedule/skus/${goal_id}`).then(res =>{
    dispatch({
      type: GET_GOAL_SKUS,
      payload: res.data
    })
    }).catch(error => {
      dispatch({
        type: SCHEDULE_ERROR,
        payload: error.response
      })
  });
};

export const enableGoal = (goal_id, schedule_id) => dispatch => {
  axios.post(`/api/manufacturingschedule/enable/:goal_id/:schedule_id`).then(res =>{
    dispatch({
      type: ENABLE_GOAL,
      payload: res.data
    })
    }).catch(error =>{
      dispatch({
        type: SCHEDULE_ERROR,
        payload: error.response
      })
  });
};

export const disableGoal = (goal_id, schedule_id) => dispatch => {
  axios.post(`/api/manufacturingschedule/disable/:goal_id/:schedule_id`).then(res =>{
    dispatch({
      type: DISABLE_GOAL,
      payload: res.data
    })
    }).catch(error =>{
      dispatch({
        type: SCHEDULE_ERROR,
        payload: error.response
      })
  });
};

export const addActivity  = (activity) => dispatch => {
  axios.post(`/api/manufacturingschedule/activity`, activity).then(res =>{
    dispatch({
      type: ADD_ACTIVITY,
      payload: res.data
    })
    }).catch(error =>{
      dispatch({
        type: SCHEDULE_ERROR,
        payload: error.response
      })
  });
};

export const updateActivity  = (activity_id, start) => dispatch => {
  axios.post(`api/manufacturingschedule/update/activity/:activity_id`, start).then(res =>{
    dispatch({
      type: UPDATE_ACTIVITY,
      payload: res.data
    })
    }).catch(error =>{
      dispatch({
        type: SCHEDULE_ERROR,
        payload: error.response
      })
  });
};