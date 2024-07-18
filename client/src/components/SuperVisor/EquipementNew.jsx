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
  const [activinput, setactivinput] = useState({});

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

  return (
    <div className={c.container}>
      <div className={c.equipimage}>
        <div className={c.image}>
          <span>upload image +</span>
        </div>

        <div className={c.equips}>
          <h3>All Equipement</h3>
          {ListEquipement.map((p, i) => (
            <React.Fragment key={i}>
              <div
                className={c.equipsContainet}
                style={{ animationDelay: `${i * 0.1}s` }}
                /* onClick={() => {
                    handleclick(p.Name);
                  }} */
              >
                <>
                  <span>{p.Name}</span>
                </>

                <div>
                  <button
                    className={c.edit}
                    /* onClick={() => UpdateEquipemnent(p.Name)} */
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
            <input type="file" accept=".xlsx,.xls" onChange={handleAddEquips} />
          </label>

          <button className={c.submit} onClick={addDataFile}>
            Submit
          </button>
        </div>
      </div>

      <div className={c.Equipoints}>
        <div>
          <h3>Tasks to be performed</h3>
        </div>
      </div>
    </div>
  );
};

export default EquipementNew;
