import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthManager = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    return token && role ? { token, role } : null;
  });

  const navigate = useNavigate();

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setUser({ token, role });

    if (role === 'admin') navigate('/dashboard/admin');
    else if (role === 'doctor') navigate('/dashboard/doctor');
    else if (role === 'patient') navigate('/dashboard/patient');
    else navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthManager.Provider value={{ user, login, logout }}>
      {children}
    </AuthManager.Provider>
  );
};

export const useAuth = () => useContext(AuthManager);
