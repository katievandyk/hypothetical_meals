import axios from 'axios';
import { GET_SALES_SUMMARY, SALES_LOADING, SALES_ERROR, SALES_GET_SKUS_BY_PL } from './types';

export const getSummary = (skus) => dispatch =>  {
  dispatch(setSalesLoading());
  axios.post(`/api/sales/summary`, skus).then(res =>{
    dispatch({
      type: GET_SALES_SUMMARY,
      payload: res.data
    })}
  ).catch(error =>{
    dispatch({
      type: SALES_ERROR,
      payload: error.response
    })
  });
};

export const getSalesSKUs = (plines, _callback) => dispatch =>  {
  dispatch(setSalesLoading());
  axios.post('/api/skus/byproductlines/',
    {
        "product_lines": plines
    }).then(res => {
    var sku_ids = [];
    Object.values(res.data).forEach(sku_arr => {
        sku_arr.forEach(sku => sku_ids.push(sku._id))
    })
    _callback(sku_ids);
    dispatch({
      type: SALES_GET_SKUS_BY_PL,
      payload: res.data
    })
  });
};

export const setSalesLoading = () => {
  return {
    type: SALES_LOADING
  };
};
