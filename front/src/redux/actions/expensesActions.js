import { EXPENSES_REQUEST, EXPENSES_SUCCESS, EXPENSES_FAILURE, AVERAGE_FAILURE, AVERAGE_SUCCESS, AVERAGE_REQUEST, DATES_FAILURE, DATES_REQUEST, DATES_SUCCESS } from '../constants/ActionTypes';
import { expenses, average, dates } from '../services/expensesService';

export const expensesByCategory = (date) => {    
    return async (dispatch) => {
      dispatch({
        type: EXPENSES_REQUEST
      });
      try {        
          const response = await expenses(date);
        if (response) {
          dispatch({
            type: EXPENSES_SUCCESS,
            payload: response
          });
        }
      } catch (error) {
        dispatch({
          type: EXPENSES_FAILURE,
          payload: error.response ? error.response.data.error : { error: "Une erreur est survenue lors de la connexion" }
        });
        throw error; // Lancer l'erreur afin qu'elle puisse être capturée par la fonction handleSubmit
      }
    };
};

export const averageByCategory = () => {    
    return async (dispatch) => {
      dispatch({
        type: AVERAGE_REQUEST
      });
      try {        
          const response = await average();
        if (response) {
          dispatch({
            type: AVERAGE_SUCCESS,
            payload: response
          });
        }
      } catch (error) {
        dispatch({
          type: AVERAGE_FAILURE,
          payload: error.response ? error.response.data.error : { error: "Une erreur est survenue lors de la connexion" }
        });
        throw error; // Lancer l'erreur afin qu'elle puisse être capturée par la fonction handleSubmit
      }
    };
};

export const getDates = () => {    
    return async (dispatch) => {
      dispatch({
        type: DATES_REQUEST
      });
      try {        
          const response = await dates();
        if (response) {
          dispatch({
            type: DATES_SUCCESS,
            payload: response
          });
        }
      } catch (error) {
        dispatch({
          type: DATES_FAILURE,
          payload: error.response ? error.response.data.error : { error: "Une erreur est survenue lors de la connexion" }
        });
        throw error; // Lancer l'erreur afin qu'elle puisse être capturée par la fonction handleSubmit
      }
    };
};