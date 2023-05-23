import { GET_USERS_REQUEST, GET_USERS_SUCCESS, GET_USERS_FAILURE, APPROVE_USERS_REQUEST, APPROVE_USERS_SUCCESS, APPROVE_USERS_FAILURE, AUTHORIZE_USERS_REQUEST, AUTHORIZE_USERS_SUCCESS, AUTHORIZE_USERS_FAILURE, RESET_EDITED_STATE } from '../constants/ActionTypes';

const initialState = {
    loading: false,
    users: [],
    error: '',
    edited: false
};

const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USERS_REQUEST:
        case APPROVE_USERS_REQUEST:
        case AUTHORIZE_USERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload,
                error: '',
            };
        case APPROVE_USERS_SUCCESS:
        case AUTHORIZE_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                error: '',
                edited: true
            };
        case RESET_EDITED_STATE:
            return {
            ...state,
            edited: false
            }
        case GET_USERS_FAILURE:
            return {
                ...state,
                loading: false,
                users: [],
                error: action.payload,
            };
        case APPROVE_USERS_FAILURE:
        case AUTHORIZE_USERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                edited: false
            };
        default:
            return state;
    }
};

export default usersReducer;