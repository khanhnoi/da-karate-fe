import { SET_LOADING } from '../constants/action_type';

export const setLoading = (status) => ({
  type: SET_LOADING,
  status
});
