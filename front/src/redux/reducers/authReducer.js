import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAILURE,
} from '../constants/ActionTypes';

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  tokens: null,
  error: null,
  isPasswordResetLoading: false,
  isPasswordResetSuccess: false,
  passwordResetError: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case LOGOUT_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case UPDATE_PASSWORD_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        tokens: action.payload,
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
      if (action.error && action.error.response && action.error.response.status === 400) {
        return {
          ...state,
          isLoading: false,
          isAuthenticated: false,
          error: 'Votre demande n\'est pas correcte. Veuillez vérifier vos informations.',
        };
      } else {
        return {
          ...state,
          isLoading: false,
          isAuthenticated: false,
          error: action.error,
        };
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        tokens: null,
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case FORGOT_PASSWORD_SUCCESS:
    case UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        isPasswordResetLoading: false,
        isPasswordResetSuccess: true,
      };
    case FORGOT_PASSWORD_FAILURE:
    case UPDATE_PASSWORD_FAILURE:
      if (action.error && action.error.response && action.error.response.status === 400) {
        return {
          ...state,
          isPasswordResetLoading: false,
          passwordResetError: 'Votre demande n\'est pas correcte. Veuillez vérifier vos informations.',
        };
      } else {
        return {
          ...state,
          isPasswordResetLoading: false,
          passwordResetError: action.error,
        };
      }
    default:
      return state;
  }
};

export default authReducer;