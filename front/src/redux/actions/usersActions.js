import { GET_USERS_REQUEST, GET_USERS_SUCCESS, GET_USERS_FAILURE, APPROVE_USERS_REQUEST, APPROVE_USERS_SUCCESS, APPROVE_USERS_FAILURE, AUTHORIZE_USERS_REQUEST, AUTHORIZE_USERS_SUCCESS, AUTHORIZE_USERS_FAILURE } from '../constants/ActionTypes';
import { userList, approve, authorize } from '../services/usersService';

export const getUsers = () => {    
    return async (dispatch) => {
      dispatch({
        type: GET_USERS_REQUEST
      });
      try {        
          const response = await userList();
        if (response) {
          dispatch({
            type: GET_USERS_SUCCESS,
            payload: response
          });
        }
      } catch (error) {
        dispatch({
          type: GET_USERS_FAILURE,
          payload: error.response ? error.response.data.error : { error: "Une erreur est survenue lors de la connexion" }
        });
        throw error; // Lancer l'erreur afin qu'elle puisse être capturée par la fonction handleSubmit
      }
    };
};
export const approveUser = (user_id) => {    
    return async (dispatch) => {
      dispatch({
        type: APPROVE_USERS_REQUEST
      });
      try {        
          const response = await approve(user_id);
        if (response) {
          dispatch({
            type: APPROVE_USERS_SUCCESS,
            payload: response
          });
        }
      } catch (error) {
        dispatch({
          type: APPROVE_USERS_FAILURE,
          payload: error.response ? error.response.data.error : { error: "Une erreur est survenue lors de la connexion" }
        });
        throw error; // Lancer l'erreur afin qu'elle puisse être capturée par la fonction handleSubmit
      }
    };
};
export const authorizeUser = (user_id) => {    
    return async (dispatch) => {
      dispatch({
        type: AUTHORIZE_USERS_REQUEST
      });
      try {        
          const response = await authorize(user_id);
        if (response) {
          dispatch({
            type: AUTHORIZE_USERS_SUCCESS,
            payload: response
          });
        }
      } catch (error) {
        dispatch({
          type: AUTHORIZE_USERS_FAILURE,
          payload: error.response ? error.response.data.error : { error: "Une erreur est survenue lors de la connexion" }
        });
        throw error; // Lancer l'erreur afin qu'elle puisse être capturée par la fonction handleSubmit
      }
    };
};