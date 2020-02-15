import { combineReducers } from 'redux';
import listReducer from './containers/List/reducer';

const root = combineReducers({
  list: listReducer
});

export default root;
