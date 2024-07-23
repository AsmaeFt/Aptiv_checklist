import c from "./EquipementNew.module.css";
import { useCallback, useEffect, useState, useRef } from "react";
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

  const [activEditEquip, setActivEditEquip] = useState(null);
  const [editEquipment, setEditEquipment] = useState(null);
  const [editText, setEditText] = useState(null);
  const [selectedEquip, setSelectedEquip] = useState("");
  const [importData, setImportData] = useState(null);
  const [image, setImage] = useState("");

  //get equips

  const GetEquipment = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/Equipment/Gete`);
      dispatch(equipmentActions.setAllEquipment(res.data));
    } catch (err) {
      console.error("Error fetching equipments:", err);
      message.error("Failed to load equipments.");
    }
  }, [dispatch]);

  useEffect(() => {
    GetEquipment();
  }, [GetEquipment]);

  //get equips

  //////////////// Equipments
  const Update_Equipemnent = (e) => {
    setActivEditEquip(e);
    setEditEquipment(e);
  };
  const Edit_Equip = async (Name) => {
    setActivEditEquip(null);
    const newPoint = {
      Name: Name,
      newOne: editEquipment,
    };
    try {
      await axios.post(`${api}/Equipment/UpdateEq`, newPoint);
      message.success("Equipment is Updated");
      dispatch(equipmentActions.editNameEquip(newPoint));
    } catch (err) {
      console.error("Error updating equipment:", err);
      message.error("Failed to update equipment.");
    }
  };
  const DeleteEquipment = async (Name) => {
    try {
      await axios.post(`${api}/Equipment/Delete`, { Name });
      dispatch(equipmentActions.deleteEquip(Name));
      message.success("Equipment deleted successfully");
    } catch (error) {
      console.error("Error deleting equipment:", error);
      message.error("Failed to delete equipment");
    }
  };
  const Add_Equip = async () => {
    if (!importData) {
      message.error("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("excelFile", importData);
    try {
      const res = await axios.post(`${api}/equipe/ImportExcel`, formData);
      message.success("Equipment Added Successfully!");
      dispatch(equipmentActions.setAllEquipment(res.data));
    } catch (err) {
      console.error("Error adding equipment:", err);
      message.error("Failed to add equipment");
    }
  };
  const handleClick = useCallback(
    (name) => {
      setSelectedEquip(name);
      const selected = equipments.find((e) => e.Name === name);
      if (selected && selected.Pic) {
        setImage(`http://10.236.148.30:8080/${selected.Pic}`);
      } else {
        setImage("");
      }
    },
    [equipments]
  );

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      const formData = new FormData();
      formData.append("pic", file);
      formData.append("Name", selectedEquip);

      try {
        const res = await axios.post(`${api}/Equipment/updateimage`, formData);
        message.success("Image Updated");
        dispatch(equipmentActions.setAllEquipment(res.data));
        return res;
      } catch (error) {
        console.error("Error updating image:", error);
        message.error("Failed to update image");
      }
    }
  };
  const triggerImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = handleImageUpload;
    input.click();
  };
  //////////////// Equipments

  //////////////// points
  const UpdatePoint = (i, d) => {
    setActivEditEquip(i);
    setEditText(d);
  };
  const saveUpdates = async (i) => {
    setActivEditEquip(null);
    const newPoint = {
      Name: selectedEquip,
      num: i,
      Description: editText,
    };
    try {
      await axios.post(`${api}/Equipment/Update`, newPoint);
      message.success("Point Updated");
      dispatch(
        equipmentActions.updatePoint({
          equipName: selectedEquip,
          pointNum: i,
          newDescription: editText,
        })
      );
    } catch (err) {
      console.error("Error updating point:", err);
      message.error("Failed to update point.");
    }
  };
  //////////////// points

  const Dataselected = useSelector((s) =>
    s.equipment.equipements.find((e) => e.Name === selectedEquip)
  );

  /////// draging points

  const [draggedPoint, setDraggedPoint] = useState(null);
  const imageRef = useRef(null);
  const [positions, setPositions] = useState([]);

  const Start = (e, i) => {
    setDraggedPoint(i);
  };

  const Drop = (e) => {
    e.preventDefault();
    if (draggedPoint !== null && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const newPosition = [...positions];
      newPosition[draggedPoint] = { x, y };
      setPositions({ 
        Num : draggedPoint,
        position : newPosition });
      setDraggedPoint(null);
    }
  };

  console.log(draggedPoint);
  console.log(positions);

  /////// draging points

  return (
    <div className={c.container}>
      <div className={c.equipimage}>
        <div className={c.image}>
          <div
            className={c.img}
            onClick={!image ? triggerImageUpload : undefined}
            onDoubleClick={triggerImageUpload}
            /* draged points  */
            onDragOver={(e) => e.preventDefault()}
            onDrop={Drop}
            ref={imageRef}
            /* draged points  */
          >
            {image ? (
              <img className={c.uploaded} src={image} alt="Equipment" />
            ) : (
              <>
                <span>
                  <img className={c.upload} src={upload} alt="Upload" />
                </span>
                <p>Upload image</p>
              </>
            )}
          </div>
        </div>

        <div className={c.equips}>
          <div className={c.Equipemnts}>
            <h3>All Equipments</h3>
            {equipments.map((p, i) => (
              <div
                key={i}
                className={c.equipsContainet}
                style={{ animationDelay: `${i * 0.1}s` }}
                onClick={() => handleClick(p.Name)}
              >
                {activEditEquip === p.Name ? (
                  <input
                    className="input"
                    value={editEquipment}
                    onChange={(e) => setEditEquipment(e.target.value)}
                    onBlur={() => Edit_Equip(p.Name)}
                  />
                ) : (
                  <span>{p.Name}</span>
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
            ))}

            <label>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setImportData(e.target.files[0])}
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
                  <span
                    draggable
                    onDragStart={(e) => Start(e, p.Num)}
                    className={c.taskNum}
                  >
                    {p.Num}
                  </span>
                  {activEditEquip === i ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveUpdates(p.Num)}
                    />
                  ) : (
                    <p>{p.Description}</p>
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
