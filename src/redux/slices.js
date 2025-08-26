import { createSlice } from "@reduxjs/toolkit";

const appSlices = createSlice({
  name: "app",
  initialState: {
    tokenValue: null,
    userId: "",
    role: "",
    fullname: "",
    isLoading: false,
    errorMsg: "",
    isAuthenticated: null,
    redirection: "",
    collapsedSidebar: true,
    openDrawer: false,
    searchingData: [],
    demandeData: [],
  },
  reducers: {
    set_token: (state, action) => {
      state.tokenValue = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.errorMsg = "";
    },
    set_role: (state, action) => {
      state.role = action.payload;
    },
    set_userId: (state, action) => {
      state.userId = action.payload;
    },
    set_fullname: (state, action) => {
      state.fullname = action.payload;
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
  set_fullname,
  set_role,
  set_userId,
} = appSlices.actions;

export default appSlices.reducer;
