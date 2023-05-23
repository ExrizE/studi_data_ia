import { EXPENSES_REQUEST, EXPENSES_SUCCESS, EXPENSES_FAILURE, AVERAGE_FAILURE, AVERAGE_REQUEST, AVERAGE_SUCCESS, DATES_FAILURE, DATES_REQUEST, DATES_SUCCESS } from '../constants/ActionTypes';

const initialState = {
    loading: false,
    expenses: {},
    averages: [],
    dates: [],
    error: '',
};

const expensesReducer = (state = initialState, action) => {
    switch (action.type) {
        case EXPENSES_REQUEST:
        case AVERAGE_REQUEST:
        case DATES_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case EXPENSES_SUCCESS:
            return {
                ...state,
                loading: false,
                expenses: action.payload,
                error: '',
            };
        case AVERAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                averages: action.payload,
                error: '',
            };
        case DATES_SUCCESS:
            return {
                ...state,
                loading: false,
                dates: action.payload,
                error: '',
            };
        case EXPENSES_FAILURE:
            return {
                ...state,
                loading: false,
                expenses: {},
                error: action.payload,
            };
        case AVERAGE_FAILURE:
            return {
                ...state,
                loading: false,
                averages: [],
                error: action.payload,
            };
        case DATES_FAILURE:
            return {
                ...state,
                loading: false,
                dates: [],
                error: action.payload,
            };
        default:
            return state;
    }
};

export default expensesReducer;