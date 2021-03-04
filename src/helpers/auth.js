import localforage from 'localforage';
import axios from 'axios';
import { isEmpty } from 'lodash';

const setHttpToken = (token) => {
  const authen = 'Authorization';
  axios.defaults.headers.common[authen] = `Bearer ${token}`;
};

const setLocalForageToken = (token) => {
  localforage.setItem('authtoken', token);
};

export const checkTokenExists = () => {
  return localforage.getItem('authtoken').then((token) => {
    if (isEmpty(token)) {
      return Promise.reject(new Error('invalid token'));
    }

    return Promise.resolve(token);
  });
};

export const setToken = (token) => {
  setLocalForageToken(token);
  setHttpToken(token);
};

export { axios };
