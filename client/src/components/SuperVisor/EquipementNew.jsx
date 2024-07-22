import c from "./EquipementNew.module.css";
import React, { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import api from "../../services/api";
import edit from "../../assets/edit.png";
import delet from "../../assets/delete.png";
import upload from "../../assets/uploadimage.png";

import { useSelector, useDispatch } from "react-redux";

import * as equipmentActions from "../store/EquipementSlice";

const EquipementNew = () => {
  const dispatch = useDispatch();
  const equipments = useSelector((state) => state.equipment.equipements);

  const [activEditEquip, setactivEditEquip] = useState(null);
  const [editEquipment, seteditEquipment] = useState(null);
  const [editText, seteditText] = useState(null);
  const [selectedEquip, setselectedEquip] = useState("");
  const [importData, setimportData] = useState("");

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
  const Add_Equip = async () => {
    if (!importData) return alert("please select a file first ! ");
    const formData = new FormData();
    formData.append("excelFile", importData);
    try {
      const res = await axios.post(`${api}/equipe/ImportExcel`, formData);
      const data = res.data;
      console.log(data);
      message.success("Equipement Added Succefuly !");
      dispatch(equipmentActions.setAllEquipment(data));
      return data;
    } catch (err) {
      console.error(err);
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

      dispatch(
        equipmentActions.updatePoint({
          equipName: selectedEquip,
          pointNum: i,
          newDescription: editText,
        })
      );

      return res.data;
    } catch (err) {
      console.error("Error updating point:", err);
      message.error("Failed to update point.");
    }
  };
  //////////////// points
  const Dataselected = useSelector((s) =>
    s.equipment.equipements.find((e) => e.Name === selectedEquip)
  );

  return (
    <div className={c.container}>
      <div className={c.equipimage}>
        <div className={c.image}>
          <div  className={c.img}>
          {Dataselected && Dataselected.Pic ? (
            <>
              <img className={c.uploaded} src={`http://10.236.148.30:8080/${Dataselected.Pic}`} alt=" Equipment Image " />
            </>
          ) : (
            <>
              <span>
                <img className={c.upload} src={upload} />
              </span>
              <p>Upload image</p>
            </>
          )}
          </div>

        </div>

        <div className={c.equips}>
          <div className={c.Equipemnts}>
            <h3>All Equipements</h3>
            {equipments.map((p, i) => (
              <React.Fragment key={i}>
                <div
                  className={c.equipsContainet}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => setselectedEquip(p.Name)}
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
                onChange={(e) => {
                  setimportData(e.target.files[0]);
                }}
              />
            </label>

            <button className={c.submit} onClick={Add_Equip}>
              Submit
            </button>
          </div>

          <div className={c.pointsEquips}>
            <h3>Tasks to be performed</h3>
            {Dataselected &&
              Dataselected.Points.map((p, i) => (
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
