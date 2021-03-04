import { axios } from '../helpers/auth';
import { BASE_URL } from '../constants/config';

const config = {
  headers: { 'content-type': 'multipart/form-data' }
};

// CREATE AN INSTANCE OF AXIOS
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000
});
axiosInstance.defaults.headers.common = axios.defaults.headers.common;

const postDataWithParams = async (url, data, params) => {
  const result = await axiosInstance.post(url, data, { params });
  return result;
};

const postDataByID = async (url, id, data) => {
  const result = await axiosInstance.post(`${url}/${id}`, data);
  return result;
};

const getDataByID = async (url, id) => {
  const result = await axiosInstance.get(`${url}/${id}`);
  return result;
};

const postDataWithIDParams = async (url, id, params) => {
  const result = await axiosInstance.post(`${url}/${id}`, params);
  return result;
};

const getDataByParams = async (url, params) => {
  const result = await axiosInstance.get(url, { params });
  return result;
};

const getTakenData = async (url) => {
  const result = await axiosInstance.get(url);
  return result;
};

const postDataMultipart = async (url, data) => {
  const result = await axiosInstance.post(url, data, config);
  return result;
};

const postData = async (url, data) => {
  const result = await axiosInstance.post(url, data);
  return result;
};

const deleteById = async (url, id) => {
  const result = await axiosInstance.delete(`${url}/${id}`);
  return result;
};

const deleteByUrl = async (url) => {
  const result = await axiosInstance.delete(url);
  return result;
};

const putData = async (url, id, data) => {
  const result = await axiosInstance.put(`${url}/${id}`, data);
  return result;
};

const putDataAcceptUser = async (url1, url2, id) => {
  const result = await axiosInstance.put(`${url1}/${id}/${url2}`);
  return result;
};

const putDataAccept = async (url1, url2, id) => {
  const result = await axiosInstance.put(`${url1}/${id}/${url2}`);
  return result;
};

const putDataWithUrl = async (url, data) => {
  const result = await axiosInstance.post(url, data);
  return result;
};

const putDataUrl = async (url, data) => {
  const result = await axiosInstance.put(url, data);
  return result;
};

export {
  axiosInstance,
  postDataWithParams,
  getDataByID,
  getTakenData,
  postDataMultipart,
  postData,
  deleteById,
  putData,
  putDataWithUrl,
  putDataUrl,
  deleteByUrl,
  getDataByParams,
  postDataWithIDParams,
  postDataByID,
  putDataAcceptUser,
  putDataAccept
};
