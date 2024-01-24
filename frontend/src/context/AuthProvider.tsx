import React, { createContext, useState } from 'react';
import { User } from '../../../types/user';

interface ProvideAuthProps {
    children: React.ReactNode;
}

interface AuthContextType {
    auth: User | null;
    setAuth: Function;
    persist: boolean;
    setPersist: Function;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<ProvideAuthProps> = ({ children }) => {
    const [auth, setAuth] = useState<User | null>(null);
    const [persist, setPersist] = useState<boolean>(
        // Default to true
        JSON.parse(localStorage.getItem('persist') || 'true')
    );
    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
