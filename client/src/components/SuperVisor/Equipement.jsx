import React, { useCallback, useEffect, useState } from "react";
import c from "./etyle.module.css";
import { List, Select, message } from "antd";
import axios from "axios";
import api from "../../services/api";

const Equipement = () => {
  const [ListEquipement, setListEquipement] = useState([]);

  const GetEquipemnt = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/equipe/Getequip`);
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

  console.log(ListEquipement);

  return (
    <>
      <div className={c["Equip_Container"]}>
        <div className={c["Equip-Image"]}>
          <div>
            <h3>Equipement Image</h3>
          </div>
        </div>

        <div className={c["Equip-Points"]}>
          <div>
            <h3>Tasks to be performed</h3>
          </div>
          <div></div>
        </div>

        <div className={c["Equip-Equip"]}>
          <div>
            <h3>All Equipement</h3>
          </div>
          <div className={c.equips}>
            {ListEquipement.map((p, i) => (
              <div key={i}>
                <span>{p.Name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Equipement;
