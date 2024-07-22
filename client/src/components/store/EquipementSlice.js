import { createSlice } from "@reduxjs/toolkit";
const EquipementSlice = createSlice({
  name: "equip",
  initialState: {
    equipements: [],
  },
  reducers: {
    setAllEquipment(s, a) {
      s.equipements = a.payload;
      console.log(a.payload);
    },
    addEquipment(s, a) {
      s.equipements.push(a.payload);
    },
    editNameEquip(s, a) {
      const { Name, newOne } = a.payload;
      const exist = s.equipements.find((e) => e.Name === Name);
      if (exist) {
        exist.Name = newOne;
      }
      console.log("Updated equipements:", a.payload);
    },
    deleteEquip(s, a) {
      s.equipements = s.equipements.filter((e) => e.Name !== a.payload);
    },
    UpdatePoints(s, a) {
      const { Name, num, Description } = a.payload;
      const exist = s.equipements.find((e) => e.Name === Name);
      if (exist) {
        const point = exist.Points.find((p) => p.Num === num);
        if (point) {
          point.Description = Description;
        }
      }
    },
  },
});
export const { setAllEquipment, addEquipment, editNameEquip, deleteEquip , UpdatePoints } =
  EquipementSlice.actions;
export default EquipementSlice.reducer;
