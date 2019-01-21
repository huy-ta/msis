import axios from 'axios';
import jwtDecode from 'jwt-decode';

const saveAuthTokenOnLocalStorage = token => {
  if (token) {
    localStorage.setItem('jwtToken', token);
  } else {
    throw new Error("Cannot save jwtToken to localStorage because its value is 'undefined'.");
  }
};

const removeAuthTokenFromLocalStorage = () => {
  localStorage.removeItem('jwtToken');
};

const deleteAuthTokenFromAxiosHeaders = () => {
  delete axios.defaults.headers.common.Authorization;
};

const setAuthTokenToAxiosHeaders = token => {
  axios.defaults.headers.common.Authorization = token;
};

const setUpAuthTokenAfterLogin = token => {
  saveAuthTokenOnLocalStorage(token);
  setAuthTokenToAxiosHeaders(token);
};

const decodeAuthToken = token => jwtDecode(token);

export {
  saveAuthTokenOnLocalStorage,
  removeAuthTokenFromLocalStorage,
  setAuthTokenToAxiosHeaders,
  deleteAuthTokenFromAxiosHeaders,
  setUpAuthTokenAfterLogin,
  decodeAuthToken
};

export default setUpAuthTokenAfterLogin;
