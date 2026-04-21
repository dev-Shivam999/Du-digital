import { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin } from "../services/api";
import { useDispatch } from "react-redux";
import { setCredentials, logout as reduxLogout } from "../features/auth/authSlice";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Initialize Redux state from local storage or fetch fresh
      dispatch(setCredentials({ user: parsedUser, token }));
    }
    setLoading(false);
  }, [token, dispatch]);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      setUser(data);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      // Dispatch to Redux
      dispatch(setCredentials({ user: data, token: data.token }));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(reduxLogout());
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
