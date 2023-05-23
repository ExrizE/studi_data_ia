import axios from 'axios';
import { isAccessToken, isRefreshToken } from '../../utils/auth';
import Cookies from 'js-cookie';
const apiUrl = "/api/auth";

export const userList = async () => {
    try {
        const response = await axios.get(`${apiUrl}/users`, {
            headers: {
              'Authorization': `Bearer ${isAccessToken()}`
            },
          });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expiré, on essaie de le rafraîchir
            try {
                const refreshResponse = await axios.post(`${apiUrl}/refresh`, {
                    refreshToken: isRefreshToken(),
                });

                // Stockez le nouveau accessToken où vous le stockez habituellement
                Cookies.set('accessToken', refreshResponse.data.accessToken);

                // On réessaie la requête initiale avec le nouveau token
                const retryResponse = await axios.get(`${apiUrl}/users`, {
                    headers: {
                        'Authorization': `Bearer ${isAccessToken()}`
                    },
                });

                return retryResponse.data;

            } catch (refreshError) {
                throw refreshError;
            }
        } else {
            throw error;
        }
    }
};

export const approve = async (user_id) => {
    try {
        const response = await axios.patch(`${apiUrl}/approve/${user_id}`, {}, {
            headers: {
                'Authorization': `Bearer ${isAccessToken()}`
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expiré, on essaie de le rafraîchir
            try {
                const refreshResponse = await axios.post(`${apiUrl}/refresh`, {
                    refreshToken: isRefreshToken(),
                });

                // Stockez le nouveau accessToken où vous le stockez habituellement
                Cookies.set('accessToken', refreshResponse.data.accessToken);

                // On réessaie la requête initiale avec le nouveau token
                const retryResponse = await axios.patch(`${apiUrl}/approve/${user_id}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${isAccessToken()}`
                    },
                });

                return retryResponse.data;

            } catch (refreshError) {
                throw refreshError;
            }
        } else {
            throw error;
        }
    }
};


export const authorize = async (user_id) => {
    try {
        const response = await axios.patch(`${apiUrl}/authorize/${user_id}`, {}, {
            headers: {
                'Authorization': `Bearer ${isAccessToken()}`
            },
          });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Token expiré, on essaie de le rafraîchir
            try {
                const refreshResponse = await axios.post(`${apiUrl}/refresh`, {
                    refreshToken: isRefreshToken(),
                });

                // Stockez le nouveau accessToken où vous le stockez habituellement
                Cookies.set('accessToken', refreshResponse.data.accessToken);

                // On réessaie la requête initiale avec le nouveau token
                const retryResponse = await axios.get(`${apiUrl}/users`, {
                    headers: {
                        'Authorization': `Bearer ${isAccessToken()}`
                    },
                });

                return retryResponse.data;

            } catch (refreshError) {
                throw refreshError;
            }
        } else {
            throw error;
        }
    }
};