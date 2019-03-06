import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  GET_USERS
} from "./types";

//Make existing user an admin
export const makeAdmin = (userData) => dispatch => {
  axios
    .post("/api/users/makeAdmin", userData)
    .then(res=> {
      dispatch(getAllUsers());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Revoke existing user admin status
export const revokeAdmin = (userData) => dispatch => {
  axios
    .post("/api/users/revokeAdmin", userData)
    .then(res=> {
      dispatch(getAllUsers());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Delete existing users
export const deleteUser = (userData) => dispatch => {
  axios
    .post("api/users/delete", userData)
    .then(res=> {
      dispatch(getAllUsers());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

// Register User
export const registerUser = (userData) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
      dispatch(getAllUsers());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      // Set token to localStorage
      console.log("on front end");
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })}
    );
};

// Login - get user token
export const loginNetID = token => dispatch => {
  axios
  .get('https://api.colab.duke.edu/identity/v1/', {
    headers: {
      'x-api-key': 'hypo-meal',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    const name = res.data.displayName;
    const username = res.data.netid;
    const userdata = {
      username: username,
      name: name
    }
    localStorage.setItem("testItem", "isRyanGreat");
    axios
      .post("/api/users/netid", userdata)
      .then(res => {
        // Save to localStorage
        // Set token to localStorage
        const { token } = res.data;

        localStorage.setItem("jwtToken", token);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  })
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};
// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

//Get all Users
export const getAllUsers = () => dispatch => {
  axios
    .get("/api/users/")
    .then(res => {
      dispatch({
        type: GET_USERS,
        payload: res.data
      });
    })
    .catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })}
    );
}
