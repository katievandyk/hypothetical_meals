import axios from 'axios';
import { GET_PLINES, ADD_PLINE, DELETE_PLINE, UPDATE_PLINE,
  PLINES_LOADING, PLINE_ERROR} from './types';

export const getPLines = (page, pagelimit) => dispatch =>  {
  dispatch(setPLinesLoading());
  axios.get(`/api/productlines/${page}/${pagelimit}`).then(res =>
    dispatch({
      type: GET_PLINES,
      payload: {data:res.data, page: page, pagelimit: pagelimit}
    })
  ).catch(error =>{
    dispatch({
      type: PLINE_ERROR,
      payload: error.response
    })
  });
};

export const setPLinesLoading = () => {
  return {
    type: PLINES_LOADING
  };
};

export const addPLine = (pline, page, pagelimit) => dispatch => {
  axios.post('/api/productlines/', pline).then(res =>{
    dispatch({
      type: ADD_PLINE,
      payload: res.data
    });
    dispatch(setPLinesLoading());
    axios.get(`/api/productlines/${page}/${pagelimit}`).then(res =>
      dispatch({
        type: GET_PLINES,
        payload: {data:res.data, page: page, pagelimit: pagelimit}
      })
    ).catch(error =>{
      dispatch({
        type: PLINE_ERROR,
        payload: error.response
      })
    });
  }
  ).catch(error =>{
    dispatch({
      type: PLINE_ERROR,
      payload: error.response
    });
  });
};

export const updatePLine = (pline, page, pagelimit) => dispatch => {
  axios.post(`/api/productlines/update/${pline.id}`, pline).then(res =>{
    dispatch({
      type: UPDATE_PLINE,
      payload: res.data
    });
    dispatch(setPLinesLoading());
    axios.get(`/api/productlines/${page}/${pagelimit}`).then(res =>
      dispatch({
        type: GET_PLINES,
        payload: {data:res.data, page: page, pagelimit: pagelimit}
      })
    ).catch(error =>{
      dispatch({
        type: PLINE_ERROR,
        payload: error.response
      })
    });
  }
  ).catch(error =>{
    dispatch({
      type: PLINE_ERROR,
      payload: error.response
    });
  });
};


export const deletePLine = id => dispatch => {
  axios.delete(`/api/productlines/${id}`).then(res =>
    dispatch({
      type: DELETE_PLINE,
      payload: id
    })
  ).catch(error =>{
    dispatch({
      type: PLINE_ERROR,
      payload: error.response
    })
  });
};
