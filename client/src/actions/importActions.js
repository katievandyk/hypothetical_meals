import axios from 'axios';
import {UPLOAD_CHECK, UPLOAD_ERROR, IMPORT_OVERWRITES, RESET_IMPORT_STATE, SET_IMPORT_LOADING} from './types';

export const uploadCheck = (file) => dispatch =>  {
  dispatch(setImportLoading());
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

export const setImportLoading = () => {
  return {
    type: SET_IMPORT_LOADING
  };
};

export const resetImportState = () => {
  return {
    type: RESET_IMPORT_STATE
  };
};

export const importOverwrites = (new_checkRes, type) => dispatch =>  {
  dispatch(setImportLoading());
  const dataObj = {"data": new_checkRes};
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
