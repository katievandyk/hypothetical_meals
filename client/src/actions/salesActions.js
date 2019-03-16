import axios from 'axios';
import { GET_SALES_SUMMARY, SALES_LOADING } from './types';

export const getSummary = (skus) => dispatch =>  {
  dispatch(setSalesLoading());
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

export const setSalesLoading = () => {
  return {
    type: SALES_LOADING
  };
};
