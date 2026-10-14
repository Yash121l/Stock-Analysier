import React, { createContext, useContext, useState } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';
import { identifyUser, resetUser, track } from '../analytics';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            const { token } = await apiLogin(email, password);
            identifyUser(token, email);
            track('login_completed');
            setIsAuthenticated(true);
            setUser({ email });
        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            const { token } = await apiRegister(email, password);
            identifyUser(token, email);
            track('signup_completed');
            setIsAuthenticated(true);
            setUser({ email });
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            resetUser();
            setIsAuthenticated(false);
            setUser(null);
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
