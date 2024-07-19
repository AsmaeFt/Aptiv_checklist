import c from "./EquipementNew.module.css";
import Select from "../UI/SelectDropdown";
import React, { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import api from "../../services/api";

import edit from "../../assets/edit.png";
import delet from "../../assets/delete.png";

const EquipementNew = () => {
  const [ListEquipement, setListEquipement] = useState([]);
  const [importData, setimportData] = useState(null);

  const [activEditEquip, setactivEditEquip] = useState(null);
  const [editEquipment, seteditEquipment] = useState(null);
  const [dataselected, setdataselected] = useState();

  //get equips
  const GetEquipemnt = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/Equipment/Gete`);
      const data = res.data;
      setListEquipement(data);
    } catch (err) {
      console.error("Error fetching equipments:", err);
      message.error("Failed to load equipments.");
    }
  }, []);

  useEffect(() => {
    GetEquipemnt();
  }, [GetEquipemnt]);

  //get equips

  const handleAddEquips = (e) => {
    setimportData(e.target.files[0]);
  };
  const addDataFile = () => {};

  const UpdateEquipemnent = (e) => {
    setactivEditEquip(e);
    seteditEquipment(e);
  };
  const saveEquipement = async (Name) => {
    setactivEditEquip(null);
    const newPoint = {
      Name: Name,
      newOne: editEquipment,
    };
    try {
      const res = await axios.post(`${api}/Equipment/UpdateEq`, newPoint);
      message.success("Equipement is Updated");
      return res.data;
    } catch (err) {
      console.error("Error fetching equipments:", err);
      message.error("Failed to load equipments.");
    }
  };
  const handleclick = async (Name) => {
    if (ListEquipement) {
      const list = ListEquipement.find((e) => e.Name === Name);
      if (list) {
        setdataselected(list);
      }
    }
  };
  const UpdatePoint = (i) => {
    setactivEditEquip(i);
  };

  console.log(activEditEquip);

  return (
    <div className={c.container}>
      <div className={c.equipimage}>
        <div className={c.image}>
          <span>upload image +</span>
        </div>

        <div className={c.equips}>
          <div className={c.Equipemnts}>
            <h3>All Equipement</h3>
            {ListEquipement.map((p, i) => (
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
                          saveEquipement(p.Name);
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
                      onClick={() => UpdateEquipemnent(p.Name)}
                    >
                      <img src={edit} />
                    </button>
                    <button
                      className={c.edit}
                      /*  onClick={() => deleteEquipment(p.Name)} */
                    >
                      <img src={delet} />
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
                <>
                  <div
                    key={i}
                    className={c.task}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span className={c.taskNum}>{p.Num}</span>

                    {activEditEquip === i ? (
                  <>
                    <textarea
                     /*  value={editText} */
                     /*  onChange={(e) => seteditText(e.target.value)}
                      onBlur={() => saveUpdates(p.Num)} */
                    />
                  </>
                ) : (
                  <>
                    <p>{p.Description}</p>
                  </>
                )}

                    <button className={c.edit} onClick={() => UpdatePoint(i)}>
                      <img src={edit} />
                    </button>
                  </div>
                </>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipementNew;
