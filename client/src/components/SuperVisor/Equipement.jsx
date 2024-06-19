import React, { useCallback, useEffect, useState } from "react";
import c from "./etyle.module.css";
import { List, Select, message } from "antd";
import axios from "axios";
import api from "../../services/api";
import edit from "../../assets/edit.png"

const Equipement = () => {
  const [ListEquipement, setListEquipement] = useState([]);
  const [ListPoints, setListPoints] = useState([]);
  const [image, setimage] = useState(null);

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

  const handleclick = async (Name) => {
    if (ListEquipement) {
      const list = ListEquipement.find((e) => e.Name === Name);
      if (list) {
        setListPoints(list.Points);
      }

      try {
        const res = await axios.get(`${api}/Equipment/get`, {
          params: { Name },
        });
        const data = res.data;
        console.log(data);
        if(!data){
          return setimage(null)
        }
        else{
          setimage(`http://10.236.148.30:8080/${data.Pic}`);
        }
        
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setimage(url);
      /* setImageFile(file);  */
    }
  };
  const triggerImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = handleImageUpload;
    input.click();
  };

  return (
    <>
      <div className={c["Equip_Container"]}>
        <div className={c["Equip-Image"]}>
          <div>
            <h3>Equipement Image</h3>
          </div>
          <div onClick={triggerImageUpload} className={c.img}>
            {image && <img src={image} alt="Uploaded Equipment" />}
          </div>
          <div>
            <button className="button">save</button>
          </div>
        </div>

        <div className={c["Equip-Points"]}>

          <div>
            <h3>Tasks to be performed</h3>
          </div>

          <div>
            {ListPoints.map((p, i) => (
              <div key={i} className={c.task}>
                <span className={c.taskNum}>{p.Num}</span>
                <p>{p.Description}</p>
                <button className={c.edit}><img src={edit}/></button>
              </div>
            ))}
          </div>
        </div>

        <div className={c["Equip-Equip"]}>
          <div>
            <h3>All Equipement</h3>
          </div>
          <div className={c.equips}>
            {ListEquipement.map((p, i) => (
              <div
                key={i}
                onClick={() => {
                  handleclick(p.Name);
                }}
              >
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
