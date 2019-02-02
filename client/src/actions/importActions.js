import axios from 'axios';
import {UPLOAD_CHECK, UPLOAD_ERROR, IMPORT_OVERWRITES} from './types';

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
      payload: error.response
    });
  });
};

export const importOverwrites = (new_checkRes, type) => dispatch =>  {
  const dataObj = {"data": new_checkRes};
  console.log('dataObj', dataObj);
  console.log('link', `/api/bulk-import/upload/`, type);
  axios.post(`/api/bulk-import/upload/${type}`, dataObj).then(res =>
    dispatch({
      type: IMPORT_OVERWRITES,
      payload: res.data
    })
  ).catch(error =>{
    console.log(error.response);
    dispatch({
      type: UPLOAD_ERROR,
      payload: error.response
    });
  });
};
