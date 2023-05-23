import { combineReducers } from 'redux';
import authReducer from './authReducer';
import expensesReducer from './expensesReducer';
import csvReducer from './csvReducer';
import usersReducer from './usersReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  expenses: expensesReducer,
  csv: csvReducer,
  users: usersReducer

});

export default rootReducer;