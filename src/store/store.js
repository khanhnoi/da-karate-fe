import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducers from '../reducer/index';

export default createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
