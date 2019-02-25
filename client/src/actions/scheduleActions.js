import axios from 'axios';
import { GET_SCHEDULE, SCHEDULE_LOADING, GET_GOAL_SKUS, ENABLE_GOAL, DISABLE_GOAL,
  ADD_ACTIVITY,GET_ACTIVITY, UPDATE_ACTIVITY, DELETE_ACTIVITY, SCHEDULE_ERROR, SCHEDULE_REPORT, SCHEDULE_KW_SEARCH} from './types';
import xios from 'axios';

export const getSchedule = () => dispatch =>  {
  dispatch(setScheduleLoading());
  axios.get(`/api/manufacturingschedule`).then(res =>{
    dispatch({
      type: GET_SCHEDULE,
      payload: res.data
    })}
  ).catch(error =>{
    dispatch({
      type: SCHEDULE_ERROR,
      payload: error.response
    })
  });
};

export const getActivities = () => dispatch =>  {
  dispatch(setScheduleLoading());
  axios.get(`/api/manufacturingschedule/activity`).then(res =>{
    dispatch({
      type: GET_ACTIVITY,
      payload: res.data
    })}
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

export const deleteActivity = (id) => dispatch => {
  axios.post(`/api/manufacturingschedule/delete/activity`, {activities: [id]}).then(res => {
    dispatch({
      type: DELETE_ACTIVITY,
      payload: id
    })
  }).catch(error =>{
    dispatch({
      type: SCHEDULE_ERROR,
      payload: error.response
    })
  });
};

export const getGoalSKUs = () => dispatch => {
  axios.get(`/api/manufacturingschedule/skus`).then(res =>{
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
  axios.post(`/api/manufacturingschedule/enable/${goal_id}/${schedule_id}`).then(res =>{
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
  axios.post(`/api/manufacturingschedule/disable/${goal_id}/${schedule_id}`).then(res =>{
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

export const addActivity  = (activity, _callback) => dispatch => {
  axios.post(`/api/manufacturingschedule/activity`, activity).then(res =>{
     _callback(res.data._id)
    dispatch({
      type: ADD_ACTIVITY,
      payload: res.data,
    })    }).catch(error =>{
      dispatch({
        type: SCHEDULE_ERROR,
        payload: error.response
      })
  });
};

export const updateActivity  = (activity, activity_id) => dispatch => {
  axios.post(`api/manufacturingschedule/update/activity/${activity_id}`, activity).then(res =>{
    dispatch({
      type: UPDATE_ACTIVITY,
      payload: res.data
    })
    dispatch(setScheduleLoading());
    axios.get(`/api/manufacturingschedule/activity`).then(res =>
      dispatch({
        type: GET_ACTIVITY,
        payload: res.data
      })
    ).catch(error =>{
         dispatch({
           type: SCHEDULE_ERROR,
           payload: error.response
         })
       });
     }).catch(error =>{
       dispatch({
         type: SCHEDULE_ERROR,
         payload: error.response
       })
     });
};

export const genScheduleReport = (obj) => dispatch =>  {
  axios.post(`/api/manufacturingschedule/report`, obj).then(res =>{
    dispatch({
      type: SCHEDULE_REPORT,
      payload: res.data
    })}
  ).catch(error =>{
    dispatch({
      type: SCHEDULE_ERROR,
      payload: error.response
    })
  });
};


