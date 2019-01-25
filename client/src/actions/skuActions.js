import axios from 'axios';
import { GET_SKU, GET_SKUS_BYPLINE, SKUS_LOADING } from './types';

export const getSKUsByPLine = (pline) => dispatch =>  {
  dispatch(setSKUsLoading());
  axios.get('/api/skus/byproductlines/' + pline).then(res =>
    dispatch({
      type: GET_SKUS_BYPLINE,
      payload: res.data
    })
  );
};

export const setSKUsLoading = () => {
  return {
    type: SKUS_LOADING
  };
};
