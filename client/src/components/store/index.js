import { configureStore } from "@reduxjs/toolkit";
import autreducer from "./loginSlice";
import equipmentReducer from "./EquipementSlice";

const store = configureStore({
  reducer: {
    login: autreducer.reducer,
    equipment: equipmentReducer,
  },
});

export default store;
