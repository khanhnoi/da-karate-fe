import { combineReducers } from 'redux';
import user from './user';
import Loading from './loading';

const reducers = combineReducers({
  user,
  Loading,
});

export default reducers;
