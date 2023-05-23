import Cookies from 'js-cookie';
export const isAuthenticated = () => {
  const cookies = document.cookie.split("; ").reduce((res, c) => {
      const [key, val] = c.split("=");
      res[key] = val;
      return res;
    }, {});
  
  return !!cookies.accessToken && !!cookies.refreshToken;
};  
export const isAdmin = () => {
  const user = JSON.parse(Cookies.get('user'));
  const userRole = user.role;
  
  if (userRole === "admin") return true
};  
export const isAccessToken = () => {
  const token = Cookies.get('accessToken');
  
  return token
};  
export const isRefreshToken = () => {
  const token = Cookies.get('refreshToken');
  
  return token
};  