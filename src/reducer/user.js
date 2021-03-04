import * as types from '../constants/action_type';

const initialState = {
  authenticated: false,
  user: null,
  errors: {},
  isRequest: false,
  isLoading: true,
  data: [],
  userDetail: null
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case types.USER_REQUEST:
      return {
        ...state,
        isLoading: action.status
      };
    case types.RESET_USER:
      return {
        ...state,
        isRequest: false,
        status: false,
        errors: {},
        userDetail: null
      };
    case types.SET_USER_DATA:
      return {
        ...state,
        user: action.user
      };
    case types.SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: action.authenticated
      };
    case types.FORM_USER_REQUEST:
      return {
        ...state,
        isRequest: action.status
      };
    case types.EDIT_USER:
      if (action.status) {
        return {
          ...state,
          status: true,
          message: 'Cập nhật thành công',
          errors: {}
        };
      }
      return {
        ...state,
        status: false,
        message: 'Vui lòng kiểm tra lại những lỗi bên dưới',
        errors: action.data
      };

    default:
      return state;
  }
};

export default user;
