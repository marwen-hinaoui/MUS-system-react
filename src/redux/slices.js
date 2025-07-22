import { createSlice } from "@reduxjs/toolkit";

const appSlices = createSlice({
  name: "app",
  initialState: {
    tokenValue: null,
    isLoading: false,
    errorMsg: null,
    isAuthenticated: null,
    redirection: null,
    collapsedSidebar: true,
  },
  reducers: {
    set_token: (state, action) => {
      state.tokenValue = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.errorMsg = null;
    },
    clear_auth: (state) => {
      state.tokenValue = null;
      state.isLoading = false;
    },
    set_loading: (state, action) => {
      state.isLoading = action.payload;
    },
    set_error: (state, action) => {
      state.errorMsg = action.payload;
      state.isLoading = false;
    },
    set_authenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    set_redirection: (state, action) => {
      state.redirection = action.payload;
    },
    set_collapsedSidebar: (state, action) => {
      state.collapsedSidebar = action.payload;
    },
  },
});

export const {
  set_token,
  clear_auth,
  set_loading,
  set_error,
  set_authenticated,
  set_redirection,
  set_collapsedSidebar,
} = appSlices.actions;

export default appSlices.reducer;
