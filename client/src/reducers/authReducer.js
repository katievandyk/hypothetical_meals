import {
    SET_CURRENT_USER,
    USER_LOADING
  } from "../actions/types";
  const isEmpty = require("is-empty");
  const initialState = {
    isAuthenticated: false,
    isAdmin: false,
    user_email: "",
    user: {},
    loading: false
  };
  export default function(state = initialState, action) {
    switch (action.type) {
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          isAdmin: action.payload.isAdmin,
          user_email: action.payload.email,
          user: action.payload
        };
      case USER_LOADING:
        return {
          ...state,
          loading: true
        };
      default:
        return state;
    }
  }