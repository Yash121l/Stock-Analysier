import React, { createContext, useContext, useState } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (email, password) => {
        try {
            await apiLogin(email, password);
            setIsAuthenticated(true);
            setUser({ email });
        } catch (error) {
            throw error;
        }
    };

    const register = async (email, password) => {
        try {
            await apiRegister(email, password);
            setIsAuthenticated(true);
            setUser({ email });
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
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
