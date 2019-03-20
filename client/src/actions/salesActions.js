import axios from 'axios';
import { GET_SALES_SUMMARY, SALES_LOADING, SALES_ERROR, SALES_GET_SKUS_BY_PL, GET_CUSTOMERS, GET_SKU_DRILLDOWN } from './types';

export const getSummary = (skus, customer) => dispatch =>  {
  const body = {"skus": skus};
  if(customer !== null) body["customer"] = customer;
  dispatch(setSalesLoading());
  axios.post(`/api/sales/summary`, body ).then(res =>{
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

export const getCustomers = () => dispatch =>  {
  dispatch(setSalesLoading());
  axios.post('/api/sales/customers').then(res => {
    dispatch({
      type: GET_CUSTOMERS,
      payload: res.data
    })
  });
};

export const getSKUDrilldown = (sku_id, obj) => dispatch =>  {
  dispatch(setSalesLoading());
  axios.post('/api/sales/detailed/' + sku_id, obj).then(res => {
    dispatch({
      type: GET_SKU_DRILLDOWN,
      payload: res.data
    })
  });
};


export const setSalesLoading = () => {
  return {
    type: SALES_LOADING
  };
};
