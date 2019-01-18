import axios from 'axios';
import { GET_INGS, ADD_ING, DELETE_ING, INGS_LOADING } from './types';

export const getIngs = () => dispatch =>  {
  dispatch(setIngsLoading());
  axios.get('/api/ingredients').then(res =>
    dispatch({
      type: GET_INGS,
      payload: res.data
    })
  );

};

export const setIngsLoading = () => {
  return {
    type: INGS_LOADING
  };
};
