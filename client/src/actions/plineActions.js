import axios from 'axios';
import { GET_PLINES, ADD_PLINE, DELETE_PLINE, UPDATE_PLINE,
  PLINES_LOADING, SEARCH_PLINES} from './types';

export const getPLines = (page, pagelimit) => dispatch =>  {
  dispatch(setPLinesLoading());
  axios.get(`/api/productlines/${page}/${pagelimit}`).then(res =>
    dispatch({
      type: GET_PLINES,
      payload: {data:res.data, page: page, pagelimit: pagelimit}
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

export const searchPLines = keywords => dispatch => {
  dispatch(setPLinesLoading());
  setPLinesLoading();
  axios.post(`/api/productlines/search`, keywords).then(res =>
    dispatch({
      type: SEARCH_PLINES,
      payload: res.data
    })
  );
};
