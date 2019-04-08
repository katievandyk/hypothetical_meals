import axios from 'axios';
import { GET_GOALS, GET_ALL_GOALS, ADD_GOAL, UPDATE_GOAL, DELETE_GOAL, GOALS_LOADING, GOALS_INGQUANTITY,
  GOAL_CALCULATOREXPORT, GOAL_EXPORT, GOAL_ERROR, SCHEDULE_KW_SEARCH, SKU_PROJECTION, GOALS_SORT, ENABLE_GOAL } from './types';

const FileDownload = require('js-file-download');

export const getGoals = (user_id) => dispatch =>  {
  dispatch(setGoalsLoading());
  axios.get('/api/manufacturing/' + user_id).then(res =>
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

export const getAllGoals = () => dispatch =>  {
  dispatch(setGoalsLoading());
  axios.get('/api/manufacturing/').then(res =>
    dispatch({
      type: GET_ALL_GOALS,
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

export const sortGoals = (field, asc) => dispatch => {
  dispatch(setGoalsLoading());
  axios.get(`/api/manufacturing/sort/${field}/${asc}`).then(res =>
    dispatch({
      type: GOALS_SORT,
      payload: {data: res.data, sortby: field, sortdir: asc}
    })
  ).catch(error =>{
    dispatch({
      type: GOAL_ERROR,
      payload: error.response
    })
  });
};

export const getGoalsIngQuantity = (goal) => dispatch =>  {
  dispatch(setGoalsLoading());
   axios.get(`/api/manufacturing/ingquantities/${goal}`).then(res =>
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
  axios.post(`/api/manufacturing`, goal).then(res => {
    dispatch({
      type: ADD_GOAL,
      payload: res.data
    });
    dispatch(setGoalsLoading());
    axios.get('/api/manufacturing').then(res =>
        {
        dispatch({
          type: GET_ALL_GOALS,
          payload: res.data
        })
      }
      ).catch(error =>{
        dispatch({
          type: GOAL_ERROR,
          payload: error.response
        })
      });
    }
  ).catch(error =>{
    dispatch({
      type: GOAL_ERROR,
      payload: error.response
    })});
}

export const updateGoal = (goal) => dispatch => {
  axios.post(`/api/manufacturing/update/${goal.id}`, goal).then(res => {
      dispatch({
        type: UPDATE_GOAL,
        payload: res.data
      });
      dispatch(setGoalsLoading());
      axios.get('/api/manufacturing').then(res =>
        {
        dispatch({
          type: GET_ALL_GOALS,
          payload: res.data
        })
      }
      ).catch(error =>{
        dispatch({
          type: GOAL_ERROR,
          payload: error.response
        })
      });
    }
  ).catch(error =>{
    dispatch({
      type: GOAL_ERROR,
      payload: error.response
    })});
}

export const enableGoal = (goal) => dispatch => {
  axios.post(`/api/manufacturing/enable/${goal._id}`).then(res => {
      dispatch({
        type: ENABLE_GOAL,
        payload: goal
      })
  }).catch(error =>{
    dispatch({
      type: GOAL_ERROR,
      payload: error.response
    })
  });
 };

export const exportGoal = (goal) => dispatch => {
  dispatch(setGoalsLoading());
    axios.get(`/api/manufacturing/export/${goal._id}`).then(res => {
      FileDownload(res.data, goal.name + '.csv')
   });
    return {
        type: GOAL_EXPORT
    };
 };

export const deleteGoal = (goal_id) => dispatch => {
  axios.delete(`/api/manufacturing/${goal_id}`).then(res =>
    dispatch({
      type: DELETE_GOAL,
      payload: goal_id
    })
  ).catch(error =>{
    dispatch({
      type: GOAL_ERROR,
      payload: error.response
    })
  });
 };

 export const exportCalculator = (goal) => dispatch => {
   dispatch(setGoalsLoading());
     axios.get(`/api/manufacturing/exportcalculator/${goal._id}`).then(res => {
       FileDownload(res.data, goal.name + '_calc.csv')
    });
    return {
        type: GOAL_CALCULATOREXPORT
    };
  };

  export const searchSchedulebyKW = keywords => dispatch => {
    axios.post('/api/manufacturingschedule/search', {keywords : keywords}).then(res => {
      dispatch({
        type: SCHEDULE_KW_SEARCH,
        payload: res.data.results
      });
    }).catch(error =>{
      dispatch({
        type: GOAL_ERROR,
        payload: error.response
      })
    });
  };

export const getSKUProjection = (id, obj) => dispatch =>  {
  dispatch(setGoalsLoading());
   axios.post(`/api/sales/projection/${id}`, obj).then(res =>
    dispatch({
      type: SKU_PROJECTION,
      payload: res.data
    })
  ).catch(error =>{
    dispatch({
      type: GOAL_ERROR,
      payload: error.response
    })
  });
};