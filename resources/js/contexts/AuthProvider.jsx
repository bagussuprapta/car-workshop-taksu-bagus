import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authenticatedUser, setAuthenticatedUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const validateToken = async (tokenValue = token) => {

        if (!tokenValue) {
            setIsAuthenticated(false);
            setAuthenticatedUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${tokenValue}`,
                },
            });

            if (!res.ok) {
                throw new Error("Invalid token");
            }

            const data = await res.json();
            setAuthenticatedUser(data);
            setIsAuthenticated(true);
        } catch (err) {
            localStorage.removeItem("token");
            setToken(null);
            setAuthenticatedUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        validateToken();
    }, [token]);

    const login = (tokenValue, user) => {
        localStorage.setItem("token", tokenValue);
        setToken(tokenValue);
        setAuthenticatedUser(user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthenticatedUser(null);
        setIsAuthenticated(false);
    };

    const refreshUser = () => {
        setLoading(true);
        validateToken();
    };

    return (
        <AuthContext.Provider
            value={{
                authenticatedUser,
                token,
                login,
                logout,
                refreshUser,
                loading,
                isAuthenticated,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
