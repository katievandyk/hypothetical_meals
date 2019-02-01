import axios from 'axios';
import {UPLOAD_CHECK, UPLOAD_ERROR} from './types';

export const uploadCheck = (file) => dispatch =>  {
  axios.post(`/api/bulk-import/upload-check`, file).then(res =>
    dispatch({
      type: UPLOAD_CHECK,
      payload: res.data
    })
  ).catch(error =>{
    console.log(error.response);
    dispatch({
      type: UPLOAD_ERROR,
      payload: {success: error.response.data.success, message: error.response.data.message}
    });
  });
};
