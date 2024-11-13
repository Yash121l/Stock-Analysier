import axios from 'axios';

// const API_URL = 'https://stock-analysier.onrender.com/api';
const API_URL = 'http://localhost:3333/api';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`,
            { email, password },
            { withCredentials: true }
        );

        localStorage.setItem('token', response.data.token);

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Login failed');
    }
};

export const register = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`,
            { email, password },
            { withCredentials: true }
        );

        localStorage.setItem('token', response.data.token);

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Registration failed');
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/logout`, {},
            { withCredentials: true }
        );

        localStorage.removeItem('token');

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Logout failed');
    }
};
