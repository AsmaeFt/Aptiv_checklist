import c from "./EquipementNew.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import api from "../../services/api";
import edit from "../../assets/edit.png";
import delet from "../../assets/delete.png";

import { useSelector, useDispatch } from "react-redux";

import * as equipmentActions from "../store/EquipementSlice";

const EquipementNew = () => {
  const dispatch = useDispatch();
  const equipments = useSelector((state) => state.equipment.equipements);

  const [activEditEquip, setactivEditEquip] = useState(null);
  const [editEquipment, seteditEquipment] = useState(null);
  const [dataselected, setdataselected] = useState();
  const [editText, seteditText] = useState(null);
  const [selectedEquip, setselectedEquip] = useState("");

  //get equips
  const GetEquipment = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/Equipment/Gete`);
      const data = res.data;
      dispatch(equipmentActions.setAllEquipment(data));
    } catch (err) {
      console.error("Error fetching equipments:", err);
      message.error("Failed to load equipments.");
    }
  }, [dispatch]);

  useEffect(() => {
    GetEquipment();
  }, [GetEquipment]);

  //////////////// Equipments
  const Update_Equipemnent = (e) => {
    setactivEditEquip(e);
    seteditEquipment(e);
  };

  const Edit_Equip = async (Name) => {
    setactivEditEquip(null);
    const newPoint = {
      Name: Name,
      newOne: editEquipment,
    };
    try {
      const res = await axios.post(`${api}/Equipment/UpdateEq`, newPoint);
      message.success("Equipment is Updated");
      dispatch(equipmentActions.editNameEquip(newPoint));
      return res.data;
    } catch (err) {
      console.error("Error updating equipment:", err);
      message.error("Failed to update equipment.");
    }
  };

  const DeleteEquipment = async (Name) => {
    try {
      const res = await axios.post(`${api}/Equipment/Delete`, { Name });
      dispatch(equipmentActions.deleteEquip(Name));
      return res.data;
    } catch (error) {
      console.error(
        "Error deleting equipment:",
        error.response?.data || error.message
      );
      throw error;
    }
  };
  //////////////// Equipments

  //////////////// points

  const UpdatePoint = (i, d) => {
    setactivEditEquip(i);
    seteditText(d);
  };
  const saveUpdates = async (i) => {
    setactivEditEquip(null);
    const newPoint = {
      Name: selectedEquip,
      num: i,
      Description: editText,
    };
    console.log(JSON.stringify(newPoint));

    try {
      const res = await axios.post(`${api}/Equipment/Update`, newPoint);
      const data = res.data;
      console.log(data);
      message.success("Point Updated");
     
      return res.data;
    } catch (err) {
      console.error("Error updating point:", err);
      message.error("Failed to update point.");
    }
  };
  //////////////// points

  const handleAddEquips = (e) => {
    setimportData(e.target.files[0]);
  };
  const addDataFile = () => {};

  const handleclick = async (Name) => {
    setselectedEquip(Name);
    const selected = equipments.find((e) => e.Name === Name);
    if (selected) {
      setdataselected(selected);
    }
  };

  return (
    <div className={c.container}>
      <div className={c.equipimage}>
        <div className={c.image}>
          <span>upload image +</span>
        </div>

        <div className={c.equips}>
          <div className={c.Equipemnts}>
            <h3>All Equipements</h3>
            {equipments.map((p, i) => (
              <React.Fragment key={i}>
                <div
                  className={c.equipsContainet}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => {
                    handleclick(p.Name);
                  }}
                >
                  {activEditEquip === p.Name ? (
                    <>
                      <input
                        className="input"
                        value={editEquipment}
                        onChange={(e) => seteditEquipment(e.target.value)}
                        onBlur={() => {
                          Edit_Equip(p.Name);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <span>{p.Name}</span>
                    </>
                  )}

                  <div>
                    <button
                      className={c.edit}
                      onClick={() => Update_Equipemnent(p.Name)}
                    >
                      <img src={edit} alt="Edit" />
                    </button>
                    <button
                      className={c.edit}
                      onClick={() => DeleteEquipment(p.Name)}
                    >
                      <img src={delet} alt="Delete" />
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}

            <label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleAddEquips}
              />
            </label>

            <button className={c.submit} onClick={addDataFile}>
              Submit
            </button>
          </div>

          <div className={c.pointsEquips}>
            <h3>Tasks to be performed</h3>
            {dataselected &&
              dataselected.Points.map((p, i) => (
                <div
                  key={i}
                  className={c.task}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className={c.taskNum}>{p.Num}</span>

                  {activEditEquip === i ? (
                    <>
                      <textarea
                        value={editText}
                        onChange={(e) => seteditText(e.target.value)}
                        onBlur={() => saveUpdates(p.Num)}
                      />
                    </>
                  ) : (
                    <>
                      <p>{p.Description}</p>
                    </>
                  )}

                  <button
                    className={c.edit}
                    onClick={() => UpdatePoint(i, p.Description)}
                  >
                    <img src={edit} alt="Edit" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipementNew;
