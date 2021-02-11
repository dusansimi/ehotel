import * as actionTypes from '../actions/actionTypes';

const initialState = {
  userID: null,
  token: null,
  role: '',
  error: null,
  loading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case actionTypes.AUTH_SUCCESS:
      return {
        ...state,
        userID: action.id,
        token: action.token,
        role: action.role,
        error: null,
        loading: false,
      };
    case actionTypes.AUTH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case actionTypes.AUTH_REFRESH:
      return {
        ...state,
        loading: false,
        error: null,
        token: localStorage.getItem('token'),
        userID: localStorage.getItem('userID'),
        role: localStorage.getItem('role'),
      };
    case actionTypes.NEW_PASS:
      return {
        ...state,
        token: action.token,
      };
    case actionTypes.AUTH_LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('userID');
      localStorage.removeItem('role');
      return {
        ...state,
        userID: null,
        token: null,
        role: '',
        error: null,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
