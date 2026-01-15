'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem('boyzclub_token');
                const savedUser = localStorage.getItem('boyzclub_user');

                if (token && savedUser) {
                    setUser(JSON.parse(savedUser));

                    // Validate token with API
                    try {
                        const response = await authAPI.me();
                        setUser(response.data.user);
                        localStorage.setItem('boyzclub_user', JSON.stringify(response.data.user));
                    } catch (error) {
                        // Token invalid, clear storage
                        localStorage.removeItem('boyzclub_token');
                        localStorage.removeItem('boyzclub_user');
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('[AuthContext] Load error:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Login function
    const login = async (email, password) => {
        const response = await authAPI.login(email, password);
        const { user, token } = response.data;

        localStorage.setItem('boyzclub_token', token);
        localStorage.setItem('boyzclub_user', JSON.stringify(user));
        setUser(user);

        // Redirect based on role
        if (user.role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/dashboard');
        }

        return user;
    };

    // Register function
    const register = async (data) => {
        const response = await authAPI.register(data);
        const { user, token } = response.data;

        localStorage.setItem('boyzclub_token', token);
        localStorage.setItem('boyzclub_user', JSON.stringify(user));
        setUser(user);

        router.push('/dashboard');
        return user;
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('boyzclub_token');
        localStorage.removeItem('boyzclub_user');
        setUser(null);
        router.push('/login');
    };

    // Update user data
    const updateUser = (updates) => {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem('boyzclub_user', JSON.stringify(updated));
    };

    // Force refresh user data from API
    const refreshUser = async () => {
        try {
            const response = await authAPI.me();
            const userData = response.data.user;
            setUser(userData);
            localStorage.setItem('boyzclub_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('[AuthContext] Refresh error:', error);
            return null;
        }
    };

    // Check if user is authenticated
    const isAuthenticated = !!user;

    // Check if user is admin
    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateUser,
            isAuthenticated,
            isAdmin,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
