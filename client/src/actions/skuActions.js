import axios from 'axios';
import { ADD_SKU, DELETE_SKU, UPDATE_SKU, SKU_KW_SEARCH,
  SKU_SORT, SKU_ING_FILTER, SKU_PLINE_FILTER, GET_SKUS, GET_SKUS_BYPLINE,
   SKUS_LOADING, SKU_ERROR, SKU_GROUP_BY_PL } from './types';

export const getSKUsByPLine = (plines) => dispatch =>  {
  dispatch(setSKUsLoading());
  axios.post('/api/skus/byproductlines/',
    {
        "product_lines": plines
    }).then(res => {
    dispatch({
      type: GET_SKUS_BYPLINE,
      payload: res.data
    })
  });
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

export const groupByPL = state => dispatch => {
  dispatch({
    type: SKU_GROUP_BY_PL,
    payload: state
  });
}

export const sortSKUs = (field, asc, page, pagelimit, obj) => dispatch => {
  dispatch(setSKUsLoading());
  axios.post(`/api/skus/filter/sort/${field}/${asc}/${page}/${pagelimit}`, obj).then(res =>
    dispatch({
      type: SKU_SORT,
      payload: {data: res.data, sortby: field, sortdir: asc, page: page, pagelimit: pagelimit, obj: obj}
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
