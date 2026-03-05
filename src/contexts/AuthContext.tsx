import { useState, createContext, useContext, useCallback, type ReactNode } from "react";

export interface User {
    id: string;
    name: string;
    role: "admin" | "operador";
}

interface AuthContextType {
    user: User | null;
    login: (id: string, name: string, role: "admin" | "operador") => void;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = useCallback((id: string, name: string, role: "admin" | "operador") => {
        setUser({ id, name, role });
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    const isAdmin = user?.role === "admin";

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
