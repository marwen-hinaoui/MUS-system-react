import { createSlice } from "@reduxjs/toolkit";

const appSlices = createSlice({
  name: "app",
  initialState: {
    tokenValue: null,
    userId: "",
    site: "",
    roleList: [],
    fullname: "",
    fonction: "",
    isLoading: false,
    isLoadingGamme: false,
    isLoadingRefresh: false,
    errorMsg: "",
    NetworkErrorMsg: "",
    isAuthenticated: null,
    redirect: "",
    redirection: "",
    collapsedSidebar: true,
    openDrawer: false,
    searchingData: [],
    demandeData: [],
    sequenceData: [],
    cover_pn: [],
    patterns: [],
  },
  reducers: {
    set_token: (state, action) => {
      state.tokenValue = action.payload;
      state.isLoading = false;
      state.isAuthenticated = true;
      state.errorMsg = "";
    },
    set_role: (state, action) => {
      state.roleList = action.payload;
    },
    set_userId: (state, action) => {
      state.userId = action.payload;
    },
    set_site: (state, action) => {
      state.site = action.payload;
    },
    set_fullname: (state, action) => {
      state.fullname = action.payload;
    },
    set_fonction: (state, action) => {
      state.fonction = action.payload;
    },
    clear_auth: (state) => {
      state.tokenValue = null;
      state.isLoading = false;
    },
    set_loading: (state, action) => {
      state.isLoading = action.payload;
    },
    set_loading_gamme: (state, action) => {
      state.isLoadingGamme = action.payload;
    },
    set_loading_refresh: (state, action) => {
      state.isLoadingRefresh = action.payload;
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
    set_redirect: (state, action) => {
      state.redirect = action.payload;
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
    set_cover_pn: (state, action) => {
      state.cover_pn = action.payload;
    },
    set_patterns: (state, action) => {
      state.patterns = action.payload;
    },
    set_sequenceData: (state, action) => {
      state.sequenceData = action.payload;
    },
    set_network_error: (state, action) => {
      state.NetworkErrorMsg = action.payload;
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
  set_sequenceData,
  set_patterns,
  set_cover_pn,
  set_fonction,
  set_loading_gamme,
  set_redirect,
  set_loading_refresh,
  set_network_error,
  set_site,
} = appSlices.actions;

export default appSlices.reducer;
