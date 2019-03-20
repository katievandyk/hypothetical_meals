import { GET_SALES_SUMMARY, SALES_LOADING, SALES_GET_SKUS_BY_PL, GET_CUSTOMERS, GET_SKU_DRILLDOWN, EXPORT_SUMMARY, EXPORT_DRILLDOWN } from '../actions/types';

const initialState = {
  loading: false,
  summary: [],
  pline_groups: {},
  summary_customers: [],
  summ_body: {},
  sku_drilldown: {},
  drilldown_body: {},
  drilldown_sku_id: ''
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_SALES_SUMMARY:
      return {
        ...state,
        summary: action.payload.data,
        summ_body: action.payload.body,
        loading: false,
      }
    case GET_SKU_DRILLDOWN:
        return {
          ...state,
          sku_drilldown: action.payload.data,
          drilldown_body: action.payload.body,
          drilldown_sku_id: action.payload.sku_id,
          loading: false,
        }
    case SALES_GET_SKUS_BY_PL:
        return {
          ...state,
          pline_groups: action.payload
        }
    case SALES_LOADING:
      return {
        ...state,
        loading: true
      }
    case GET_CUSTOMERS:
      return {
        ...state,
        summary_customers: action.payload
      }
    case EXPORT_SUMMARY:
      return {
        ...state
      }
    case EXPORT_DRILLDOWN:
      return {
        ...state
      }
    default:
      return state;
  }

}
