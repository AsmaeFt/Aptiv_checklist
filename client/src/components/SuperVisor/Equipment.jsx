import React, { useCallback, useEffect, useState, useRef } from "react";
import c from "./Equip.module.css";
import { Select, message } from "antd";
import api from "../../services/api";
import axios from "axios";

const Equipment = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [listEquip, setListEquip] = useState([]);
  const [listPoints, setListPoints] = useState([]);
  const [selectedEquip, setSelectedEquip] = useState("");
  const [draggedPoint, setDraggedPoint] = useState(null);
  const [positions, setPositions] = useState([]);
  const [ref, setRef] = useState("");
  const imageRef = useRef(null);

  const GetEquipments = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/equipe/Getequip`);
      const data = res.data;
      const equipOptions = data.map((e) => ({
        value: e.Name,
        label: e.Name,
      }));
      setListEquip(equipOptions);
    } catch (err) {
      console.error("Error fetching equipments:", err);
      message.error("Failed to load equipments.");
    }
  }, []);

  const GetPoints = useCallback(async () => {
    if (!selectedEquip) return;
    try {
      const res = await axios.get(`${api}/equipe/Getequip`);
      const data = res.data;
      const equipment = data.find((e) => e.Name === selectedEquip);
      if (equipment) {
        setListPoints(equipment.Points);
        setPositions(Array(equipment.Points.length).fill(null));
      } else {
        setListPoints([]);
        setPositions([]);
      }
    } catch (err) {
      console.error("Error fetching points:", err);
      message.error("Failed to load points for the selected equipment.");
    }
  }, [selectedEquip]);

  useEffect(() => {
    GetEquipments();
  }, [GetEquipments]);

  useEffect(() => {
    GetPoints();
  }, [GetPoints]);

  const handleEquipChange = (value) => {
    setSelectedEquip(value);
    setImage(null);
    setImageFile(null);
    setPositions([]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
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

  const handleDragStart = (e, index) => {
    setDraggedPoint(index);
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
      const newPositions = [...positions];
      newPositions[draggedPoint] = { x, y };
      setPositions(newPositions);
      setDraggedPoint(null);
    }
  };

  const handleSave = async () => {
    if (!imageFile) {
      message.error("Please upload an image first.");
      return;
    }
    if (!selectedEquip) {
      message.error("Please select an equipment.");
      return;
    }
    if (!ref.trim()) {
      message.error("Please provide a reference.");
      return;
    }

    const updatedPoints = listPoints
      .map((point, index) => ({
        Description: point.Description,
        Num: point.Num,
        Position: positions[index] || null,
      }))
      .filter((point) => point.Position !== null);

    if (updatedPoints.length === 0) {
      message.warning("No points have been placed on the image.");
      return;
    }

    const formData = new FormData();
    formData.append("name", selectedEquip);
    formData.append("ref", ref.trim());
    formData.append("pic", imageFile);
    formData.append("Points", JSON.stringify(updatedPoints));
    console.log(JSON.stringify(formData, null, 2));

    console.log("Sending data:", {
      Name: selectedEquip,
      ref: ref.trim(),
      pic: imageFile.name,
      Points: updatedPoints,
    });

    try {
      const res = await axios.post(
        `${api}/Equipment/AddNew_Equipment`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(res.data);
      message.success("Equipment Successfully Added");
      setImage(null);
      setImageFile(null);
      setPositions([]);
      setSelectedEquip("");
    } catch (err) {
      message.error(err.message || "An error occurred while saving.");
      console.error(err);
    }
  };

  return (
    <div className={c.container}>
      <div className={c.Image}>
        <div
          className={c.img}
          onClick={triggerImageUpload}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          ref={imageRef}
        >
          {!image && <h2>Click to Upload Image</h2>}
          {image && <img src={image} alt="Uploaded Equipment" />}
          {positions.map(
            (pos, i) =>
              pos && (
                <div
                  key={i}
                  className={c.task}
                  style={{
                    position: "absolute",
                    top: `${pos.y * 100}%`,
                    left: `${pos.x * 100}%`,
                    transform: "translate(-50%, -50%)",
                    cursor: "move",
                  }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                >
                  <span className={c.taskNum}>{listPoints[i].Num}</span>
                </div>
              )
          )}
        </div>
        <div className={c.ref}>
          <textarea
            placeholder="Enter Reference..."
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
        </div>
      </div>

      <div className={c.points}>
        <div className={c.pointsContainer}>
          <div className={c.equipSelect}>
            <h3>Choose Equipment</h3>
            <Select
              showSearch
              placeholder="Select an Equipment..."
              options={listEquip}
              onChange={handleEquipChange}
              style={{ width: "20rem" }}
            />
          </div>

          <div className={c.taskList}>
            <h3>Tasks to be performed</h3>
            <div>
              {listPoints.map((point, i) => (
                <div key={i} className={c.task}>
                  <span
                    draggable={!!image}
                    onDragStart={(e) => handleDragStart(e, i)}
                    className={c.taskNum}
                  >
                    {point.Num}
                  </span>
                  <span className={c.taskDesc}>{point.Description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={c.saveButton}>
            <button className="button" onClick={handleSave}>
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Equipment;
