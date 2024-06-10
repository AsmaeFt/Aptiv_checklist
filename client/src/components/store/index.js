import { configureStore } from "@reduxjs/toolkit";
import autreducer from "./loginSlice";

const store = configureStore({
  reducer: {
    login: autreducer.reducer,
  },
});

export default store;
