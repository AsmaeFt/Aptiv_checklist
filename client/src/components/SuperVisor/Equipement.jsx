import React, { useCallback, useEffect, useState, useRef, act } from "react";
import c from "./etyle.module.css";
import { message } from "antd";
import axios from "axios";
import api from "../../services/api";
import edit from "../../assets/edit.png";
import upload from "../../assets/uplo.png";
import delet from "../../assets/delete.png";

const Equipement = () => {
  const [ListEquipement, setListEquipement] = useState([]);
  const [ListPoints, setListPoints] = useState([]);
  const [positions, setPositions] = useState([]);
  const [image, setimage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [points, setPoints] = useState([]);
  const [draggedPoint, setDraggedPoint] = useState(null);
  const imageRef = useRef(null);
  const [ref, setRef] = useState("");
  const [selectedEquip, setSelectedEquip] = useState("");
  const [activeEdit, setactiveEdit] = useState(null);
  const [editText, seteditText] = useState(null);
  const [importData, setimportData] = useState(null);
  const [refe, setrefe] = useState("");
  const [editEquipment, seteditEquipment] = useState(null);
  const [activEditEquip, setactivEditEquip] = useState(null);

  ////////

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

  const handleclick = async (Name) => {
    setSelectedEquip(Name);
    if (ListEquipement) {
      const list = ListEquipement.find((e) => e.Name === Name);
      if (list) {
        setListPoints(list.Points);
        setimage(list.Pic ? `http://10.236.148.30:8080/${list.Pic}` : null);
        setrefe(list.ref ? list.ref : "");
        setPoints(list.Points);
      }
    }
  };
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

  //////////

  const handleStart = (e, i) => {
    setDraggedPoint(i);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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

  ///
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
      const data = res.data;
      setListEquipement(data);
      message.success("Equipement is Updated");
      return res.data;
    } catch (err) {
      console.error("Error fetching equipments:", err);
      message.error("Failed to load equipments.");
    }
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
  ///

  const handleSave = async () => {
    if (!imageFile) {
      message.warning("Please Upload an Image first !");
    }
    if (!ref.trim()) {
      message.warning("Please provide a reference.");
      return;
    }

    const Points = ListPoints.map((p, i) => ({
      Description: p.Description,
      Num: p.Num,
      Position: positions[i] || null,
    })).filter((p) => p.Position !== null);

    if (Points.length === 0) {
      message.warning("No points have been placed on the image.");
      return;
    }

    const formData = new FormData();
    formData.append("Name", selectedEquip);
    formData.append("ref", ref.trim());
    formData.append("pic", imageFile);
    formData.append("Points", JSON.stringify(Points));
    console.log("Sending data:", {
      Name: selectedEquip,
      ref: ref.trim(),
      pic: imageFile.name,
      Points: Points,
    });
    try {
      const res = await axios.post(
        `${api}/Equipment/AddNew_Equipment`,
        formData
      );
      const data = res.data;
      console.log(res.data);
      message.success("Equipment Successfully Added");
      setImageFile(null);
      setimage(null);
      setPositions([]);
      setSelectedEquip("");
      setListEquipement(data);
    } catch (err) {
      message.error(err.message || "An error occurred while saving.");
      console.error(err);
    }
  };
  const handleAddData = (e) => {
    setimportData(e.target.files[0]);
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
  const changePosition = async (e, num) => {
    e.preventDefault();
    const rect = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setPoints((pre) =>
      pre.map((pt) => (pt.Num === num ? { ...pt, Position: { x, y } } : pt))
    );

    const newPosition = {
      Name: selectedEquip,
      Num: num,
      Position: {
        x: x,
        y: y,
      },
    };

    console.log(newPosition);

    try {
      const res = await axios.post(
        `${api}/Equipment/updatePosition`,
        newPosition
      );
      message.success("Position Updated");
      const data = res.data;
      console.log(data);
      setListEquipement(data);
      return res;
    } catch (error) {
      console.error("Error updating position:", error);
      message.error("Failed to update position");
    }
  };

  const updateImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const imageFile = e.target.files[0];
      if (imageFile) {
        const url = URL.createObjectURL(imageFile);
        setimage(url);
        setImageFile(imageFile);

        const formData = new FormData();
        formData.append("Name", selectedEquip);
        formData.append("pic", imageFile);

        console.log("Sending data:", {
          Name: selectedEquip,
          pic: imageFile.name,
        });

        try {
          const res = await axios.post(
            `${api}/Equipment/updateimage`,
            formData
          );
          message.success("Image Updated");
          const data = res.data;
          console.log(res);
          setListEquipement(data);
          return res;
        } catch (error) {
          console.error("Error updating image:", error);
          message.error("Failed to update image");
        }
      }
    };
    input.click();
  };

  const saveref = async () => {
    const newRef = {
      Name: selectedEquip,
      ref: refe,
    };
    console.log(newRef);
    try {
      const res = await axios.post(`${api}/Equipment/updateRef`, newRef);
      message.success("Reference Updated");
      const data = res.data;
      console.log(data);
      setListEquipement(data);
      return res;
    } catch (error) {
      console.error("Error updating Reference:", error);
      message.error("Failed to update Reference");
    }
  };

  return (
    <>
      <div className={c["Equip_Container"]}>
        <div className={c["Equip-Image"]}>
          <div
            onClick={!image ? triggerImageUpload : undefined}
            className={c.img}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDoubleClick={image ? updateImage : undefined}
            ref={imageRef}
          >
            {image ? (
              <>
                <img src={image} alt=" Equipment Image " />
                {points.map((p, i) => (
                  <React.Fragment key={i}>
                    {p.Position && (
                      <div
                        className={c["dragedpoints"]}
                        style={{
                          top: `${p.Position.y * 100}%`,
                          left: `${p.Position.x * 100}%`,
                          cursor: "move",
                        }}
                        draggable
                        onDragStart={(e) =>
                          e.dataTransfer.setData("text/plain", p.Num.toString())
                        }
                        onDrag={(e) => e.preventDefault()}
                        onDragEnd={(e) => changePosition(e, p.Num)}
                      >
                        <span>{p.Num}</span>
                      </div>
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

            {positions?.map(
              (p, i) =>
                p && (
                  <div
                    key={i}
                    className={c["dragedpoints"]}
                    style={{
                      top: `${p.y * 100}%`,
                      left: `${p.x * 100}%`,
                      cursor: "move",
                    }}
                    draggable
                    onDragStart={(e) => handleStart(e, i)}
                  >
                    <span>{ListPoints[i].Num}</span>
                  </div>
                )
            ) ?? null}
          </div>

          {!refe ? (
            <React.Fragment>
              <div className={c.ref}>
                <textarea
                  placeholder="Enter Reference..."
                  value={ref}
                  onChange={(e) => setRef(e.target.value)}
                />
              </div>
              <div>
                <button onClick={handleSave} className="button">
                  save
                </button>
              </div>
            </React.Fragment>
          ) : (
            <>
              <div>
                <fieldset>
                  <legend style={{ color: "orangered" }}>Reference:</legend>
                  <input 
                  style={{width:'90%' , padding:'0.3rem' , margin:'0.3rem', textAlign:'center',border:'1px dashed orangered'}}
                    onChange={(e) => setrefe(e.target.value)}
                    onBlur={saveref}
                    value={refe}
                  />
                </fieldset>
              </div>
            </>
          )}
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
                  onDragStart={(e) => handleStart(e, i)}
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
export default Equipement;
