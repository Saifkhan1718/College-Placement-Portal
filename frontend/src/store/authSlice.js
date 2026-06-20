import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Get token and user from localStorage if exists
const token = localStorage.getItem('token') || null;
let user = null;
try {
  const cachedUser = localStorage.getItem('user');
  if (cachedUser) user = JSON.parse(cachedUser);
} catch (e) {
  localStorage.removeItem('user');
}

const initialState = {
  user,
  profile: null,
  token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

// Set authorization header globally if token exists
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
      
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    },
    authFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.profile = null;
      state.error = action.payload;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    },
    profileSuccess: (state, action) => {
      state.isLoading = false;
      state.profile = action.payload.profile;
      if (action.payload.user) {
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.profile = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  profileSuccess,
  logoutUser,
  clearError,
  setLoading,
} = authSlice.actions;

// Async Thunks
const API_URL = 'http://localhost:5000/api'; // Or use package proxy/env

export const login = (credentials) => async (dispatch) => {
  dispatch(authStart());
  try {
    const { data } = await axios.post(`${API_URL}/auth/login`, credentials);
    dispatch(authSuccess(data));
    // Fetch profile details right after
    dispatch(getProfile());
    return true;
  } catch (error) {
    const msg = error.response?.data?.message || 'Login failed. Check your internet connection.';
    dispatch(authFailure(msg));
    return false;
  }
};

export const registerUser = (userData) => async (dispatch) => {
  dispatch(authStart());
  try {
    const { data } = await axios.post(`${API_URL}/auth/register`, userData);
    dispatch(authSuccess(data));
    return true;
  } catch (error) {
    const msg = error.response?.data?.message || 'Registration failed.';
    dispatch(authFailure(msg));
    return false;
  }
};

export const googleAuthLogin = (googleData) => async (dispatch) => {
  dispatch(authStart());
  try {
    const { data } = await axios.post(`${API_URL}/auth/google-login`, googleData);
    dispatch(authSuccess(data));
    dispatch(getProfile());
    return true;
  } catch (error) {
    dispatch(authFailure(error.response?.data?.message || 'Google authentication failed.'));
    return false;
  }
};

export const getProfile = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${API_URL}/auth/me`);
    dispatch(profileSuccess({ profile: data.profile, user: data.user }));
  } catch (error) {
    console.error('Error fetching profile:', error);
    // If token invalid, trigger logout
    if (error.response?.status === 401) {
      dispatch(logoutUser());
    }
  }
};

export default authSlice.reducer;
