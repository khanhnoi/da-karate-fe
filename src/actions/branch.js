import { postData, getDataByID, deleteByUrl, putDataUrl, deleteById, putData, postDataByID } from '../services/base_services';
import createNotification from '../component/common/Notifications';
import { GET_BRANCH_REQUEST, GET_CLUB_IN_BRANCH, GET_ALL_BRANCH } from '../constants/config';

export const fetchBranchs = (pageNumber, perPage = 10, keyword = '') => {
  return postData(GET_ALL_BRANCH, {
    keyword,
    page: pageNumber,
    per_page: perPage
  })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const fetchBranchsMember = (id, pageNumber, perPage = 10, keyword = '') => {
  return postDataByID(GET_CLUB_IN_BRANCH, id, {
    keyword,
    page: pageNumber,
    per_page: perPage
  })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getBranchDetail = (id) => {
  return getDataByID(GET_BRANCH_REQUEST, id)
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err.message);
    });
}

export const addBranch = (data) => {
  return postData(GET_BRANCH_REQUEST, data)
    .then((res) => {
      if (res.status === 201) {
        return createNotification('success', res.data.message)
      }
      return createNotification('error', res.data.message);
    })
    .catch((err) => {
      return createNotification('error', err.message);
    })
}

export const editBranch = (data, id) => {
  return putData(GET_BRANCH_REQUEST, id, data)
    .then((res) => {
      if (res.status === 200) {
        return createNotification('success', res.data.message);
      }
      return createNotification('error', res.data.message);
    })
    .catch((err) => {
      return createNotification('error', err.message);
    });
};

export const deleteBranch = (id) => {
  return deleteById(GET_BRANCH_REQUEST, id)
    .then((res) => {
      if (res.status === 200) {
        return createNotification('success', res.data.message);
      }
      return createNotification('error', res.data.message);
    })
    .catch((err) => {
      return createNotification('error', err.message);
    });
}