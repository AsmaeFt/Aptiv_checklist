import React, { useCallback, useEffect, useState, useRef, act } from "react";
import c from "./etyle.module.css";
import { message } from "antd";
import axios from "axios";
import api from "../../services/api";
import edit from "../../assets/edit.png";
import upload from "../../assets/uplo.png";
import delet from "../../assets/delete.png";

const NewEquip = () => {
  const [ListEquipement, setListEquipement] = useState([]);
  const [activEditEquip, setactivEditEquip] = useState(null);
  const [importData, setimportData] = useState(null);
  const [editEquipment, seteditEquipment] = useState(null);
  const [ListPoints, setListPoints] = useState([]);
  const [image, setimage] = useState(null);
  const [refe, setrefe] = useState("");
  const [selectedEquip, setSelectedEquip] = useState("");
  const [activeEdit, setactiveEdit] = useState(null);
  const [editText, seteditText] = useState(null);
  const [draggedPoint, setDraggedPoint] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const imageRef = useRef(null);
  const [positions, setPositions] = useState([]);

  /// GET EQUIPEMENTS

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

  ////

  const handleclick = useCallback(
    async (Name) => {
      setSelectedEquip(Name);
      if (ListEquipement) {
        const list = ListEquipement.find((e) => e.Name === Name);
        if (list) {
          setListPoints(list.Points);
          setimage(list.Pic ? `http://10.236.148.30:8080/${list.Pic}` : null);
          setrefe(list.ref ? list.ref : "");
        }
      }
    },
    [ListEquipement]
  );

  useEffect(() => {
    handleclick();
  }, [handleclick]);

  const handleAddData = (e) => {
    setimportData(e.target.files[0]);
  };

  const saveEquipement = async (Name) => {
    setactivEditEquip(null);

    const newPoint = {
      Name: Name,
      newOne: editEquipment,
    };

    try {
      const res = await axios.post(`${api}/Equipment/UpdateEq`, newPoint);
      const data = res.data;
      setListEquipement(data);
      message.success("Equipement is Updated");
      return res.data;
    } catch (err) {
      console.error("Error fetching equipments:", err);
      message.error("Failed to load equipments.");
    }
  };

  const UpdateEquipemnent = (e) => {
    setactivEditEquip(e);
    seteditEquipment(e);
  };

  const deleteEquipment = async (Name) => {
    try {
      const res = await axios.post(`${api}/Equipment/Delete`, { Name });
      console.log("Delete response:", res.data);
      const data = res.data;
      setListEquipement(data);
      setListPoints([]);
      setimage(null);
      return data;
    } catch (error) {
      console.error(
        "Error deleting equipment:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const addDataFile = async () => {
    if (!importData) return alert("please select a file first ! ");

    const formData = new FormData();
    formData.append("excelFile", importData);
    try {
      const res = await axios.post(`${api}/equipe/ImportExcel`, formData);
      const data = res.data;
      setListEquipement(data);
      console.log(data);
      message.success("Equipement Added Succefuly !");
      return data;
    } catch (err) {
      console.error(err);
    }
  };
  ////

  ////
  const UpdatePoint = (i) => {
    setactiveEdit(i);
    seteditText(ListPoints[i].Description);
  };
  const saveUpdates = async (i) => {
    setactiveEdit(null);
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
      setListEquipement(data);
      message.success("Point Updated");
      return res.data;
    } catch (err) {
      console.error("Error fetching equipments:", err);
      message.error("Failed to load equipments.");
    }
  };

  ////
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setimage(url);
      setImageFile(file);
    }
  };
  const triggerImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = handleImageUpload;
    input.click();
  };

  const handleStart = (e, i) => {
    setDraggedPoint(i);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedPoint !== null && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const newPosition = [...positions];
      newPosition[draggedPoint] = { x, y };
      setPositions(newPosition);
      setDraggedPoint(null);
    }
  };

  ////

  console.log(positions);

  return (
    <>
      <div className={c["Equip_Container"]}>
        <div className={c["Equip-Image"]}>
          <div
            onClick={triggerImageUpload}
            className={c.img}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            ref={imageRef}
          >
            {image ? (
              <>
                <img src={image} alt=" Equipment Image " />
                {ListPoints.map((p, i) => (
                  <React.Fragment key={i}>
                    {p.Position ? (
                      <div
                        className={c["dragedpoints"]}
                        style={{
                          top: `${p.Position.y * 100}%`,
                          left: `${p.Position.x * 100}%`,
                          cursor: "move",
                        }}
                      >
                        <span>{p.Num}</span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </React.Fragment>
                ))}
              </>
            ) : (
              <>
                <p id={c.imageupload}>
                  upload image <img src={upload} />
                </p>
              </>
            )}
          </div>
        </div>

        <div className={c["Equip-Points"]}>
          <div>
            <h3>Tasks to be performed</h3>
          </div>

          <div>
            {ListPoints.map((p, i) => (
              <div key={i} className={c.task}>
                <span
                  draggable={
                    !ListPoints.find((point) => point.Num === p.Num)?.Position
                  }
                  onDragStart={(e) => handleStart(e, p.Num)}
                  className={c.taskNum}
                >
                  {p.Num}
                </span>

                {activeEdit === i ? (
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

                <button className={c.edit} onClick={() => UpdatePoint(i)}>
                  <img src={edit} />
                </button>
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
              <React.Fragment key={i}>
                <div
                  className={c.equipsContainet}
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
                      onClick={() => deleteEquipment(p.Name)}
                    >
                      <img src={delet} />
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className={c.equips}>
            <label>
              <input type="file" accept=".xlsx,.xls" onChange={handleAddData} />
            </label>

            <button className={c.submit} onClick={addDataFile}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewEquip;
