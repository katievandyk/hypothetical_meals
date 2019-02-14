import axios from 'axios';
import { SORT_FORMULAS, ADD_FORMULA, DELETE_FORMULA, UPDATE_FORMULA,
  FORMULAS_LOADING, FORMULA_ERROR, FORMULA_KW_SEARCH, FORMULA_ING_FILTER} from './types';

export const setFormulasLoading = () => {
  return {
    type: FORMULAS_LOADING
  };
};

export const searchFormulasByKW = keywords => dispatch => {
  dispatch({
    type: FORMULA_KW_SEARCH,
    payload: keywords
  });
};

export const filterByIngs = (ids) => dispatch => {
  dispatch({
    type: FORMULA_ING_FILTER,
    payload: ids
  });
};

export const sortFormulas = (field, asc, page, pagelimit, obj) => dispatch => {
  dispatch(setFormulasLoading());
  axios.post(`/api/formulas/filter/sort/${field}/${asc}/${page}/${pagelimit}`, obj).then(res =>
    dispatch({
      type: SORT_FORMULAS,
      payload: {data: res.data, sortby: field, sortdir: asc, page: page, pagelimit: pagelimit, obj: obj}
    })
  ).catch(error =>{
    dispatch({
      type: FORMULA_ERROR,
      payload: error.response
    })
  });
};

export const addFormula = (formula, sortby, sortdir, page, pagelimit, obj) => dispatch => {
  axios.post('/api/formulas/', formula).then(res =>{
    dispatch({
      type: ADD_FORMULA,
      payload: res.data
    });
    dispatch(setFormulasLoading());
    axios.post(`api/formulas/filter/sort/${sortby}/${sortdir}/${page}/${pagelimit}`, obj).then(res =>
      dispatch({
        type: SORT_FORMULAS,
        payload: {data:res.data, sortby: sortby, sortdir: sortdir, page: page, pagelimit: pagelimit, obj: obj}
      })
    ).catch(error =>{
      dispatch({
        type: FORMULA_ERROR,
        payload: error.response
      })
    });
  }
  ).catch(error =>{
    dispatch({
      type: FORMULA_ERROR,
      payload: error.response
    });
  });
};

export const updateFormula = (formula, sortby, sortdir, page, pagelimit, obj) => dispatch => {
  axios.post(`/api/formulas/update/${formula._id}`, formula).then(res =>{
    dispatch({
      type: UPDATE_FORMULA,
      payload: res.data
    });
    dispatch(setFormulasLoading());
    axios.post(`/api/formulas/filter/sort/${sortby}/${sortdir}/${page}/${pagelimit}`, obj).then(res =>
      dispatch({
        type: SORT_FORMULAS,
        payload: {data:res.data, sortby: sortby, sortdir: sortdir, page: page, pagelimit: pagelimit, obj: obj}
      })
    ).catch(error =>{
      dispatch({
        type: FORMULA_ERROR,
        payload: error.response
      })
    });
  }
  ).catch(error =>{
    dispatch({
      type: FORMULA_ERROR,
      payload: error.response
    });
  });
};


export const deleteFormula = id => dispatch => {
  axios.delete(`/api/formulas/${id}`).then(res =>
    dispatch({
      type: DELETE_FORMULA,
      payload: id
    })
  ).catch(error =>{
    dispatch({
      type: FORMULA_ERROR,
      payload: error.response
    })
  });
};
