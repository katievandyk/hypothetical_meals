import axios from 'axios';
import { GET_PLINES, ADD_PLINE, DELETE_PLINE, UPDATE_PLINE,
  PLINES_LOADING} from './types';

export const getPLines = (page) => dispatch =>  {
  dispatch(setPLinesLoading());
  axios.get(`/api/productlines/${page}/10`).then(res =>
    dispatch({
      type: GET_PLINES,
      payload: {data:res.data, page: page}
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
