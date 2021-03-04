import { postData } from '../services/base_services';

export const fetchClubs = (pageNumber) => {
  postData('/clubs', {
    keyword: '',
    page: pageNumber,
    // eslint-disable-next-line camelcase
    per_page: 5
  })
    .then((res) => {
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const test = () => {
  return 0;
};
