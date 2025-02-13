import { createSlice } from "@reduxjs/toolkit";

// Initial Slice
const initialState = {
  isAuthenticated: false,
  user: {
    _id: "",
    email: "",
    fullName: "",
    tasks: [],
  },
  loading: false,
  error: null,
  token: null,
  tokenExpiration: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.tokenExpiration = action.payload.tokenExpiration;
      state.loading = false;
      state.error = null;
    },

    // Logout
    logout: () => initialState,

    // Set Auth Error
    setAuthError: (state, action) => {
      state.error = action.payload;
    },

    // Set Loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { login, logout, setAuthError, setLoading } = authSlice.actions;

export default authSlice.reducer;
