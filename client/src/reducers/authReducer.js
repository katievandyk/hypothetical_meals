import {
    SET_CURRENT_USER,
    USER_LOADING,
    SET_NETID_USER
  } from "../actions/types";
  const isEmpty = require("is-empty");
  const initialState = {
    isAuthenticated: false,
    isAdmin: false,
    user_username: "",
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
          user_username: action.payload.username,
          user: action.payload
        };
      case USER_LOADING:
        return {
          ...state,
          loading: true
        };
      case SET_NETID_USER:
        return {
          ...state,
          isAuthenticated: true,
          isAdmin: action.payload.isAdmin,
          user_username: action.payload.username,
          user:action.payload
        }
      default:
        return state;
    }
  }