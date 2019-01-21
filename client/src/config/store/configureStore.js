import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import authReducer from 'Services/authentication/reducer';
import errorReducer from 'Services/handleError/reducer';
import stylesReducer from '../styles/reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      errors: errorReducer,
      styles: stylesReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};
