import axios from 'axios';
import Cookies from 'js-cookie';
const apiUrl = "https://studi-data-ia.vercel.app/api/auth";

export const login = async (userName, password, deviceId) => {
  const response = await axios.post(`${apiUrl}/login`, { userName, password, deviceId });
  if (response.status !== 200) {
    throw new Error(response.data.error);
  }
  return response.data;
};

export const register = async (email, password, passwordRepeat, firstName, lastName, userName) => {
  try {
    const response = await axios.post(`${apiUrl}/register`, { email, password, passwordRepeat, firstName, lastName, userName });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async (token) => {
  try {
    await axios.post(`${apiUrl}/logout`, { token });
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    await axios.post(`${apiUrl}/forgotpassword`, { email });
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (resetToken, newPassword) => {
  try {
    await axios.post(`${apiUrl}/login`, { resetToken, newPassword });
  } catch (error) {
    throw error;
  }
};