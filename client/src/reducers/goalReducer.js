import {GET_GOALS, ADD_GOAL, DELETE_GOAL, GOALS_LOADING} from '../actions/types';

const initialState = {
 /* goals: [{name:"fall goal", sku_list:[{sku:"wheat", quantity:500}, {sku:"flour", quantity:30}]}, {name:"spring goal",  sku_list:[{sku:"tomato soup", quantity:554} ]}, {name:"winter goal", sku_list:[{sku:"idk", quantity:2204}, {sku:"hot chocolate", quantity:243},
   {sku:"meat", quantity:93}, {sku:"tofu", quantity:0}]}], */
  goals: [],
  loading: false
};

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_GOALS:
      return {
        ...state,
        goals: action.payload,
        loading: false
      }
    case GOALS_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state;
  }

}
