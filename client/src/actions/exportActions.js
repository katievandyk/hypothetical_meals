import axios from 'axios';
import { EXPORT_SKUS, EXPORT_PLINES, EXPORT_INGS, EXPORT_FORMULAS, EXPORT_INGDEP_REPORT, EXPORT_SUMMARY } from './types';

const FileDownload = require('js-file-download');

export const exportSKUs = (obj) => dispatch => {
   axios.post('/api/bulk-export/skus', obj).then(res => {
     FileDownload(res.data, 'skus_' + Date.now() + '.csv')
   });
   return {
       type: EXPORT_SKUS
   };
 };

export const exportPLines = () => dispatch => {
     axios.post('/api/bulk-export/productlines').then(res => {
     FileDownload(res.data, 'product_lines_' + Date.now() + '.csv')
   });
   return {
       type: EXPORT_PLINES
   };
 };

 export const exportIngs = (obj) => dispatch => {
      axios.post('/api/bulk-export/ingredients', obj).then(res => {
      FileDownload(res.data, 'ingredients_' + Date.now() + '.csv')
    });
    return {
        type: EXPORT_INGS
    };
  };

  export const exportIngDepReport = (obj) => dispatch => {
        axios.post('/api/ingredients/filter/report', obj).then(res => {
        FileDownload(res.data, 'ingredient_dep_reports_' + Date.now() + '.csv')
    });
    return {
        type: EXPORT_INGDEP_REPORT
    }
  };

 export const exportFormulas = (obj) => dispatch => {
      axios.post('/api/bulk-export/formulas', obj).then(res => {
      FileDownload(res.data, 'formulas_' + Date.now() + '.csv')
    });
    return {
        type: EXPORT_FORMULAS
    };
  };

  export const exportSummary = (summ_body) => dispatch =>  {
    const body = summ_body;
    body.export = true;
    axios.post(`/api/sales/summary`, body ).then(res =>{
      FileDownload(res.data, 'sales_summary_' + Date.now() + '.csv')
    });
    return {
        type: EXPORT_SUMMARY
    };}
