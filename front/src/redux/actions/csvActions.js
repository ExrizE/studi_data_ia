import { CSV_FAILURE, CSV_REQUEST, CSV_SUCCESS } from '../constants/ActionTypes';
import { getCsv } from '../services/csvServices';

export const getFile = (rowCount) => {    
    return async (dispatch) => {
      dispatch({
        type: CSV_REQUEST
      });
      try {        
          const response = await getCsv(rowCount);
        if (response) {
          dispatch({
            type: CSV_SUCCESS,
            payload: response
          });
        }
      } catch (error) {
        dispatch({
          type: CSV_FAILURE,
          payload: error.response ? error.response.data.error : { error: "Une erreur est survenue lors de la connexion" }
        });
        throw error; // Lancer l'erreur afin qu'elle puisse être capturée par la fonction handleSubmit
      }
    };
};