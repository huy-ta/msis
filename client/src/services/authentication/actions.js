import axios from 'axios';

import { GET_ERRORS } from 'Services/handleError/actionTypes';
import { SET_CURRENT_USER } from './actionTypes';
import {
  setUpAuthTokenAfterLogin,
  removeAuthTokenFromLocalStorage,
  deleteAuthTokenFromAxiosHeaders,
  decodeAuthToken
} from './helpers/authTokenHelper';

const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
});

const loginUser = userData => async dispatch => {
  try {
    const response = await axios.post('/api/auth/login', userData, {
      timeout: 10000
    });

    const { authToken } = response.data.details;
    setUpAuthTokenAfterLogin(authToken);

    const decoded = decodeAuthToken(authToken);
    dispatch(setCurrentUser(decoded));
  } catch (error) {
    console.log(error);
    dispatch({
      type: GET_ERRORS,
      payload: error.response
    });
  }
};

const logoutUser = () => dispatch => {
  removeAuthTokenFromLocalStorage();
  deleteAuthTokenFromAxiosHeaders();
  dispatch(setCurrentUser({}));
};

export { loginUser, setCurrentUser, logoutUser };
