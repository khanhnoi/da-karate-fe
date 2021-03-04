import * as types from '../constants/action_type';

const Loading = (state = true, action) => {
  switch (action.type) {
    case types.SET_LOADING:
      return action.status;
    default:
      return state;
  }
};

export default Loading;
