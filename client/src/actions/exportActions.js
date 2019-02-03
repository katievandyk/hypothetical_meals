import axios from 'axios';
import { EXPORT_SKUS, EXPORT_PLINES, EXPORT_INGS, EXPORT_FORMULAS } from './types';

const FileDownload = require('js-file-download');

export const exportSKUs = (obj) => dispatch => {
     axios.post('/api/bulk-export/skus', obj).then(res => {
     FileDownload(res.data, 'skus.csv')
   });
   return {
       type: EXPORT_SKUS
   };
 };

export const exportPLines = () => dispatch => {
     axios.post('/api/bulk-export/productlines').then(res => {
     FileDownload(res.data, 'product_lines.csv')
   });
   return {
       type: EXPORT_PLINES
   };
 };

 export const exportIngs = (obj) => dispatch => {
      axios.post('/api/bulk-export/ingredients', obj).then(res => {
      FileDownload(res.data, 'ingredients.csv')
    });
    return {
        type: EXPORT_INGS
    };
  };

 export const exportFormulas = (obj) => dispatch => {
      axios.post('/api/bulk-export/formulas', obj).then(res => {
      FileDownload(res.data, 'formulas.csv')
    });
    return {
        type: EXPORT_FORMULAS
    };
  };