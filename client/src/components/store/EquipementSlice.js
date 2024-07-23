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
    updatePoint(s, a) {
        const { equipName, pointNum, newDescription } = a.payload;
        const equipment = s.equipements.find(e => e.Name === equipName);
        if (equipment) {
          const point = equipment.Points.find(p => p.Num === pointNum);
          if (point) {
            point.Description = newDescription;
          }
        }
      },
      add_pic(s,a){

      }
  },
});
export const { setAllEquipment, addEquipment, editNameEquip, deleteEquip , updatePoint } =
  EquipementSlice.actions;
export default EquipementSlice.reducer;
