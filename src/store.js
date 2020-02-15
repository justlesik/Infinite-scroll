import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import root from './reducers';

const configureStore = (state = {}) => {
  let middlewares = [thunkMiddleware, logger];
  let enhancers = applyMiddleware(...middlewares);

  return createStore(root, state, enhancers);
};

const store = configureStore();

export default store;
