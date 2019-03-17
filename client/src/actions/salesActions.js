import axios from 'axios';
import { GET_SALES_SUMMARY, SALES_LOADING, SALES_ERROR } from './types';

export const getSummary = (skus) => dispatch =>  {
  dispatch(setSalesLoading());
  axios.post(`/api/sales/summary`, skus).then(res =>{
    dispatch({
      type: GET_SALES_SUMMARY,
      payload: res.data
    })}
  ).catch(error =>{
    dispatch({
      type: SALES_ERROR,
      payload: error.response
    })
  });
};

export const setSalesLoading = () => {
  return {
    type: SALES_LOADING
  };
};
