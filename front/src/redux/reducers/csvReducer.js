import { CSV_FAILURE, CSV_REQUEST, CSV_SUCCESS } from '../constants/ActionTypes';

const initialState = {
    loading: false,
    file: null,
    error: '',
};

const csvReducer = (state = initialState, action) => {
    switch (action.type) {
        case CSV_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case CSV_SUCCESS:
            return {
                ...state,
                loading: false,
                file: action.payload,
                error: '',
            };
        case CSV_FAILURE:
            return {
                ...state,
                loading: false,
                file: null,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default csvReducer;