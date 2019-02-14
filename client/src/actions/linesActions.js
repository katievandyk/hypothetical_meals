import axios from 'axios';
import { GET_LINES, ADD_LINE, UPDATE_LINE, DELETE_LINE, LINES_LOADING, LINE_ERROR } from './types';

export const getLines = () => dispatch =>  {
  dispatch(setLinesLoading());
  axios.get('/api/manufacturinglines').then(res =>
    dispatch({
      type: GET_LINES,
      payload: res.data
    })
  ).catch(error =>{
    dispatch({
      type: LINE_ERROR,
      payload: error.response
    })
  });
};

export const setLinesLoading = () => {
  return {
    type: LINES_LOADING
  };
};

export const addLine = (line) => dispatch =>  {
  axios.post(`/api/manufacturinglines`, line).then(res =>
    dispatch({
      type: ADD_LINE,
      payload: res.data
    })
  ).catch(error =>{
    dispatch({
      type: LINE_ERROR,
      payload: error.response
    })
  });
};

export const updateLine = (line) => dispatch => {
  axios.post(`/api/manufacturinglines/update/${line.id}`, line).then(res => {
      dispatch({
        type: UPDATE_LINE,
        payload: res.data
      });
      dispatch(setLinesLoading());
      axios.get(`/api/manufacturinglines`).then(res =>
        dispatch({
          type: GET_LINES,
          payload: res.data
        })
      ).catch(error =>{
           dispatch({
             type: LINE_ERROR,
             payload: error.response
           })
         });
    }
  ).catch(error =>{
    dispatch({
      type: LINE_ERROR,
      payload: error.response
    })});
};