import { createSlice } from "@reduxjs/toolkit";
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoged: {
      logedIn: false,
      token: "",
      role: "",
      userName: "",
    },
  },
  reducers: {
    logIn: (st, act) => {
      st.isLoged = {
        logedIn: true,
        token: act.payload.token,
        role: act.payload.role,
        userName: act.payload.userName,
      };
      console.log("Auth State Updated:", st.isLoged);
    },
    logOut: (st, act) => {
      st.isLoged = {
        logedIn: false,
        token: "",
        role: "",
        userName: "",
      };
    },
  },
});
export const loginActions = authSlice.actions;
export default authSlice;
