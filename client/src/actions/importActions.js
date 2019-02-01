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

export const importOverwrites = (new_overWrite, new_no_overWrite, type) => dispatch =>  {
  console.log(new_overWrite, new_no_overWrite, type);
};
