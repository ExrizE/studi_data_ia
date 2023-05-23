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
import { v4 as uuidv4 } from 'uuid';
import * as authService from '../services/authService';
import Cookies from 'js-cookie';

export const setAuthTokens = (accessToken, refreshToken, user) => {
  Cookies.set('accessToken', accessToken)
  Cookies.set('refreshToken', refreshToken)
  Cookies.set('user', JSON.stringify(user))
};

export const loginRequest = ({ userName, password }) => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN_REQUEST
    });
    try {
      const deviceId = uuidv4(); // génère un deviceId unique
      const response = await authService.login(userName, password, deviceId);
      if (response) {
        setAuthTokens(response.accessToken, response.refreshToken, response.user)
        
        dispatch({
          type: LOGIN_SUCCESS,
          payload: response.data
        });
      }
    } catch (error) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: error.response ? error.response.data.error : { error: "Une erreur est survenue lors de la connexion" }
      });
      throw error; // Lancer l'erreur afin qu'elle puisse être capturée par la fonction handleSubmit
    }
  };
};

export const registerRequest = ({email, password, passwordRepeat, firstName, lastName, userName}) => {
return async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
  const user = await authService.register(email, password, passwordRepeat, firstName, lastName, userName);
  dispatch({ type: REGISTER_SUCCESS, payload: user });
  } catch (error) {
  dispatch({ 
    type: REGISTER_FAILURE, 
    payload: error.response ? error.response.data.error : { error: "Une erreur est survenue lors de l'inscription" } 
  });
  throw error;
  }
};
};

export const logoutRequest = () => {
return async (dispatch) => {
  dispatch({ type: LOGOUT_REQUEST });
  try {
  const response = await authService.logout(Cookies.get('refreshToken'));
  if(response){
    dispatch({ 
      type: LOGOUT_SUCCESS,      
      payload: response.data
    });
  }
  } catch (error) {
  dispatch({ 
    type: LOGOUT_FAILURE, 
    payload: error.response ? error.response.data.error : { error: "Une erreur est survenue lors de la déconnexion" } 
  });
  throw error;
  }
};
};

export const forgotPasswordRequest = (email) => {
return async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
  await authService.forgotPassword(email);
  dispatch({ type: FORGOT_PASSWORD_SUCCESS });
  } catch (error) {
  dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: error.response ? error.response.data : { error: "Une erreur est survenue lors de la réinitialisation du mot de passe" } });
  }
};
};

export const updatePasswordRequest = (email, password, token) => {
return async (dispatch) => {
  dispatch({ type: UPDATE_PASSWORD_REQUEST });
  try {
  await authService.updatePassword(email, password, token);
  dispatch({ type: UPDATE_PASSWORD_SUCCESS });
  } catch (error) {
  dispatch({ type: UPDATE_PASSWORD_FAILURE, payload: error.response ? error.response.data : { error: "Une erreur est survenue lors de la mise à jour du mot de passe" } });
  }
};
};