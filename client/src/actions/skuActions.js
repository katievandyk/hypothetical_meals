import axios from 'axios';
import { GET_SKUS, GET_SKUS_BYPLINE, SKUS_LOADING, SKUS_INGQUANTITY } from './types';

export const getSKUsByPLine = (pline) => dispatch =>  {
  dispatch(setSKUsLoading());
  axios.get('/api/skus/byproductlines/' + pline).then(res =>
    dispatch({
      type: GET_SKUS_BYPLINE,
      payload: res.data
    })
  );
};

export const getSKUsIngQuantity = (skus) => dispatch =>  {
  dispatch(setSKUsLoading());
  axios.post(`/api/skus/ingquantities`, skus).then(res =>
    dispatch({
      type: SKUS_INGQUANTITY,
      payload: res.data
    })
  );
};

export const getSKUs = () => dispatch => {
  dispatch(setSKUsLoading());
  axios.get('/api/skus/').then(res =>
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
