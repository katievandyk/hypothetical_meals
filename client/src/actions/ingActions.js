import axios from 'axios';
import { GET_INGS, ADD_ING, DELETE_ING, INGS_LOADING, UPDATE_ING } from './types';

export const getIngs = () => dispatch =>  {
  dispatch(setIngsLoading());
  axios.get('/api/ingredients').then(res =>
    dispatch({
      type: GET_INGS,
      payload: res.data
    })
  );
};

export const addIng = ing => dispatch => {
  axios.post('/api/ingredients', ing).then(res =>
    dispatch({
      type: ADD_ING,
      payload: res.data
    })
  );
};

export const updateIng = ing => dispatch => {
  axios.post(`/api/ingredients/update/${ing.id}`, ing).then(res =>
    dispatch({
      type: UPDATE_ING,
      payload: res.data
    })
  );
};

export const deleteIng = id => dispatch => {
  axios.delete(`/api/ingredients/${id}`).then(res =>
    dispatch({
      type: DELETE_ING,
      payload: id
    })
  );
};

export const setIngsLoading = () => {
  return {
    type: INGS_LOADING
  };
};
