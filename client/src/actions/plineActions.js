import axios from 'axios';
import { GET_PLINES, ADD_PLINE, DELETE_PLINE, UPDATE_PLINE,
  PLINES_LOADING} from './types';

const FileDownload = require('js-file-download');

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

export const addPLine = pline => dispatch => {
  axios.post('/api/productlines/', pline).then(res =>
    dispatch({
      type: ADD_PLINE,
      payload: res.data
    })
  );
};

export const updatePLine = pline => dispatch => {
  axios.post(`/api/productlines/update/${pline.id}`, pline).then(res =>
    dispatch({
      type: UPDATE_PLINE,
      payload: res.data
    })
  );
};

export const deletePLine = id => dispatch => {
  axios.delete(`/api/productlines/${id}`).then(res =>
    dispatch({
      type: DELETE_PLINE,
      payload: id
    })
  );
};
