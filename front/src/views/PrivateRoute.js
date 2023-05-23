import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

export default function PrivateRoute ({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={(props) => (
      isAuthenticated()
        ? <Component {...props} />
        : <Redirect to={{
              pathname: '/auth/login',
              state: { from: props.location }
            }} />
    )} />
  );
}