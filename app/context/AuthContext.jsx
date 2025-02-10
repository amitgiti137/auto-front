"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load user from localStorage when app starts
    useEffect(() => {
        const firstName = localStorage.getItem("firstName") || "";
        const lastName = localStorage.getItem("lastName") || "";
        const email = localStorage.getItem("email") || "";
        const userId = localStorage.getItem("userId") || "";
        const vendorId = localStorage.getItem("vendorId") || "";
        const department = localStorage.getItem("department") || "";
        const designation = localStorage.getItem("designation") || "";
        const employeeCode = localStorage.getItem("employeeCode") || "";
        const activeStatus = localStorage.getItem("activeStatus") || "";

        if (firstName && lastName && email && userId && vendorId) {
            setUser({ firstName, lastName, email, userId, vendorId, department, designation, employeeCode, activeStatus});
        }
    }, []);

    // Function to update user after login
    const login = (userData) => {
        setUser(userData);
    };

    // Function to clear user after logout
    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
