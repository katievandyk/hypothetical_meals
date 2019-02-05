import axios from 'axios';
import { GET_INGS, ADD_ING, DELETE_ING, INGS_LOADING, UPDATE_ING,
GET_ING_SKUS, ING_SKUS_LOADING, ING_KW_SEARCH, ING_SORT, ING_SKU_FILTER,
GEN_INGDEP_REPORT, ING_ERROR} from './types';

export const getIngs = () => dispatch =>  {
  dispatch(setIngsLoading());
  axios.post(`/api/ingredients/filter/sort/name/asc/1/10`).then(res =>
    dispatch({
      type: GET_INGS,
      payload: res.data
    })
  ).catch(error =>{
    dispatch({
      type: ING_ERROR,
      payload: error.response
    })
  });
};

export const addIng = (ing, field, asc, page, pagelimit, obj) => dispatch => {
  axios.post('/api/ingredients', ing).then(res => {
    dispatch({
      type: ADD_ING,
      payload: res.data
    })
  }).catch(error =>{
    dispatch({
      type: ING_ERROR,
      payload: error.response
    })
  });
    dispatch(setIngsLoading());
    axios.post(`/api/ingredients/filter/sort/${field}/${asc}/${page}/${pagelimit}`, obj).then(res =>
      dispatch({
        type: ING_SORT,
        payload: {data: res.data, sortby: field, sortdir: asc, page: page, pagelimit: pagelimit, obj: obj}
      })
    ).catch(error =>{
         dispatch({
           type: ING_ERROR,
           payload: error.response
         })
       });
  };

export const updateIng = (ing, field, asc, page, pagelimit, obj) => dispatch => {
  axios.post(`/api/ingredients/update/${ing.id}`, ing).then(res => {
      dispatch({
        type: UPDATE_ING,
        payload: res.data
      });
      dispatch(setIngsLoading());
      axios.post(`/api/ingredients/filter/sort/${field}/${asc}/${page}/${pagelimit}`, obj).then(res =>
        dispatch({
          type: ING_SORT,
          payload: {data: res.data, sortby: field, sortdir: asc, page: page, pagelimit: pagelimit, obj: obj}
        })
      ).catch(error =>{
           dispatch({
             type: ING_ERROR,
             payload: error.response
           })
         });
    }
  )};

export const deleteIng = id => dispatch => {
  axios.delete(`/api/ingredients/${id}`).then(res =>
    dispatch({
      type: DELETE_ING,
      payload: id
    })
  ).catch(error =>{
    dispatch({
      type: ING_ERROR,
      payload: error.response
    })
  });
};

export const getIngSKUs = id => dispatch => {
  dispatch(setIngSKUsLoading());
  axios.get(`/api/ingredients/${id}/skus`).then(res =>
    dispatch({
      type: GET_ING_SKUS,
      payload: res.data
    })
  ).catch(error =>{
    dispatch({
      type: ING_ERROR,
      payload: error.response
    })
  });
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
  dispatch({
    type: ING_KW_SEARCH,
    payload: keywords
  });
};

export const sortIngs = (field, asc, page, pagelimit, obj) => dispatch => {
  dispatch(setIngsLoading());
  axios.post(`/api/ingredients/filter/sort/${field}/${asc}/${page}/${pagelimit}`, obj).then(res =>
    dispatch({
      type: ING_SORT,
      payload: {data: res.data, sortby: field, sortdir: asc, page: page, pagelimit: pagelimit, obj: obj}
    })
  ).catch(error =>{
    dispatch({
      type: ING_ERROR,
      payload: error.response
    })
  });
};

export const genIngDepReport = (obj) => dispatch => {
  axios.post(`/api/ingredients/filter/`, obj).then(res =>
    dispatch({
      type: GEN_INGDEP_REPORT,
      payload: {data: res.data, obj: obj}
    })
  ).catch(error =>{
    dispatch({
      type: ING_ERROR,
      payload: error.response
    })
  });
};

export const filterBySKUs = (ids) => dispatch => {
    dispatch({
      type: ING_SKU_FILTER,
      payload: ids
    })
};
