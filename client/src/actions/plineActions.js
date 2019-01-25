import axios from 'axios';
import { GET_PLINES, ADD_PLINE, DELETE_PLINE, PLINES_LOADING } from './types';

export const getPLines = () => dispatch =>  {
  dispatch(setPLinesLoading());
  axios.get('/api/productlines').then(res =>
    dispatch({
      type: GET_PLINES,
      payload: res.data
    })
  );

};

export const setPLinesLoading = () => {
  return {
    type: PLINES_LOADING
  };
};
