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
    openDrawer: false,
    searchingData: [],
    demandeData: null,
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
    set_drawer: (state, action) => {
      state.openDrawer = action.payload;
    },
    set_data_searching: (state, action) => {
      state.searchingData = action.payload;
    },
    set_demande_data_table: (state, action) => {
      state.demandeData = action.payload;
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
  set_drawer,
  set_data_searching,
  set_demande_data_table,
} = appSlices.actions;

export default appSlices.reducer;
