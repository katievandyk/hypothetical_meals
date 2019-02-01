import axios from 'axios';
import { ADD_SKU, DELETE_SKU, UPDATE_SKU, SKU_KW_SEARCH,
  SKU_SORT, SKU_ING_FILTER, SKU_PLINE_FILTER, GET_SKUS, GET_SKUS_BYPLINE,
   SKUS_LOADING, SKU_ERROR } from './types';
export const getSKUsByPLine = (pline) => dispatch =>  {
  dispatch(setSKUsLoading());
  axios.get('/api/skus/byproductlines/' + pline).then(res =>
    dispatch({
      type: GET_SKUS_BYPLINE,
      payload: res.data
    })
  );
};

export const addSKU = sku => dispatch => {
  axios.post('/api/skus/', sku).then(res =>
    dispatch({
      type: ADD_SKU,
      payload: res.data
    })
  );
};

export const updateSKU = sku => dispatch => {
  console.log(sku);
  axios.post(`/api/skus/update/${sku.id}`, sku).then(res =>
    dispatch({
      type: UPDATE_SKU,
      payload: res.data
    })
  );
};

export const deleteSKU = id => dispatch => {
  axios.delete(`/api/skus/${id}`).then(res =>
    dispatch({
      type: DELETE_SKU,
      payload: id
    })
  );
};

export const getSKUs = () => dispatch => {
  dispatch(setSKUsLoading());
  axios.post(`/api/skus/filter/sort/name/asc/1/10`).then(res =>
    dispatch({
      type: GET_SKUS,
      payload: res.data
    })
  );
};

export const setSKUsLoading = () => {
  return {
    type: SKUS_LOADING
  };
};

export const searchSKUbyKW = keywords => dispatch => {
  dispatch({
    type: SKU_KW_SEARCH,
    payload: keywords
  });
};

export const sortSKUs = (field, asc, page, obj) => dispatch => {
  dispatch(setSKUsLoading());
  axios.post(`/api/skus/filter/sort/${field}/${asc}/${page}/10`, obj).then(res =>
    dispatch({
      type: SKU_SORT,
      payload: {data: res.data, sortby: field, sortdir: asc, page: page, obj: obj}
    })
  ).catch(error =>{
    dispatch({
      type: SKU_ERROR
    })
  });
};

export const filterByIngs = (ids) => dispatch => {
  dispatch({
    type: SKU_ING_FILTER,
    payload: ids
  });
};

export const filterByPLines = (ids) => dispatch => {
  dispatch({
    type: SKU_PLINE_FILTER,
    payload: ids
  });
};
