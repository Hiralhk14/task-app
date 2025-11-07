'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  token: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage?.getItem('authToken');
    const userData = localStorage?.getItem('userData');

    if (token && userData) {
      try {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token,
            user: JSON.parse(userData)
          }
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage?.removeItem('authToken');
        localStorage?.removeItem('userData');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = JSON?.parse(localStorage?.getItem('users') || '[]');
      const user = users?.find(u => u?.email === email && u?.password === password);

      if (user) {
        const token = btoa(`${user?.email}-${Date?.now()}`);
      
        localStorage?.setItem('authToken', token);
        localStorage?.setItem('userData', JSON?.stringify(user));

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token: token,
            user: user
          }
        });

        toast.success('Login successful!');
        return { success: true };
      } else {
        if (email === 'emily@example.com' && password === 'emilyspass') {
          const demoUser = {
            id: 1,
            email: 'emily@example.com',
            username: 'emily',
            firstName: 'Emily',
            lastName: 'Johnson'
          };
          
          const token = btoa(`${demoUser.email}-${Date.now()}`);
          localStorage?.setItem('authToken', token);
          localStorage?.setItem('userData', JSON.stringify(demoUser));

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              token: token,
              user: demoUser
            }
          });

          toast.success('Demo login successful!');
          return { success: true };
        }
        
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'AUTH_ERROR' });
      toast.error(error.message || 'Login failed. Please check your credentials.');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.email === userData.email || u.username === userData.username);

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }
      const newUser = {
        id: Date.now(),
        ...userData,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      dispatch({ type: 'SET_LOADING', payload: false });

      toast.success('Registration successful! Please login with your credentials.');
      return { success: true };

    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'AUTH_ERROR' });
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};