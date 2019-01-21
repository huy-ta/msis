import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import './styles.scss';

import App from './App';
import { history } from './config/routers/AppRouter';
import configureStore from './config/store/configureStore';
import theme from './config/styles/theme';
import { setDefaultTheme } from './config/styles/actions';
import { setAuthTokenToAxiosHeaders, decodeAuthToken } from './services/authentication/helpers/authTokenHelper';
import { logoutUser, setCurrentUser } from './services/authentication/actions';

const store = configureStore();
store.dispatch(setDefaultTheme(theme));

const jwtToken = localStorage.getItem('jwtToken');
if (jwtToken) {
  setAuthTokenToAxiosHeaders(jwtToken);
  const decoded = decodeAuthToken(jwtToken);
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  // The expiry time in jwtToken is calculated in seconds
  const currentTime = moment() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    history.push('/');
  }
}

const appRoot = document.getElementById('app');
ReactDOM.render(<App store={store} />, appRoot);
