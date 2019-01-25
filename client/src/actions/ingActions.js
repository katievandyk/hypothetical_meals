import axios from 'axios';
import { GET_INGS, ADD_ING, DELETE_ING, INGS_LOADING, UPDATE_ING,
GET_ING_SKUS, ING_SKUS_LOADING, ING_KW_SEARCH, ING_SORT } from './types';

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

export const getIngSKUs = id => dispatch => {
  dispatch(setIngSKUsLoading());
  axios.get(`/api/ingredients/${id}/skus`).then(res =>
    dispatch({
      type: GET_ING_SKUS,
      payload: res.data
    })
  );
};

export const setIngSKUsLoading = () => {
  return {
    type: ING_SKUS_LOADING
  };
};

export const setIngsLoading = () => {
  return {
    type: INGS_LOADING
  };
};

export const searchIngbyKW = keywords => dispatch => {
  console.log(keywords);
  axios.get('/api/ingredients/search', {'headers':{'key': 'Content-Type', 'value': 'application/json'}, 'params': {'keywords':'salt'}}).then(res =>
    dispatch({
      type: ING_KW_SEARCH,
      payload: res.data
    })
  );
};

export const sortIngs = (field, asc) => dispatch => {
  dispatch(setIngsLoading());
  axios.get(`api/ingredients/sort/${field}/${asc}`).then(res =>
    dispatch({
      type: ING_SORT,
      payload: res.data
    })
  );
};
