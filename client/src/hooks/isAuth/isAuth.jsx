// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userId, setuserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (
      !token &&
      window.location.pathname !== '/' &&
      window.location.pathname !== '/login'
    ) {
      window.location.href = '/';
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, setUserRole, userId, setuserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
