import React, { useCallback, useEffect, useState } from "react";
import c from "./checklist.module.css";
import axios from "axios";
import api from "../../services/api";
import icon from "../../assets/APTV-2cd4b44e.jpg";
import { getShiftDate } from "../functions/utilitis";

const Checklist = () => {
  const [image, setImage] = useState("");
  const [points, setPoints] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState([]);

  const GetEquipement = useCallback(async () => {
    try {
        const res = await axios.get(
            `${api}/Equipment/GetEquipenet?name=Equipment 1`
          );
      const data = res.data;
      setImage(`http://localhost:8080/${data.Pic}`); // Prepend server URL
      setPoints(data.Points);
      return data;
    } catch (err) {
      console.error(err);
    }
  }, []);
  useEffect(() => {
    GetEquipement();
  }, [GetEquipement]);
  const getProblem = (num, description) => {
    console.log("Point Number:", num);
    console.log("Description:", description);

    const isPointSelected = selectedPoints.some((point) => point.Num === num);
    if (!isPointSelected) {
      setSelectedPoints((prevPoints) => [
        ...prevPoints,
        { Num: num, Description: description },
      ]);
    } else {
      setSelectedPoints((prevPoints) =>
        prevPoints.filter((point) => point.Num !== num)
      );
    }
  };
  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
  }, []);
  const getdate = new Date();
  const Curent_Shift = getShiftDate(getdate);
  console.log(Curent_Shift);
  const submitCheckList = () => {};
  return (
    <>
      <div style={{ width: "100%" }}>
        <div className={c["Header-Checklist"]}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3> <span className={c.highlight}>Maintenance 1er Niveau</span> A Effectuer Par Les Opérateurs </h3>
          </div>

          <div>
            <fieldset>
              <legend>Ref</legend>
              <span>EAGP_5-3_MG-NAF_05-F06_FR Effective date : 04/09/2023</span>
            </fieldset>
          </div>
        </div>
        <div className={c["Header2-Checklist"]}>
          <fieldset>
            <legend>Project :</legend>
            <span>K9 KSK</span>
          </fieldset>

          <fieldset>
            <legend>FAMILY :</legend>
            <span>PDB</span>
          </fieldset>

          <fieldset>
            <legend>CREW :</legend>
            <span>K03D</span>
          </fieldset>

          <fieldset>
            <legend>STATION :</legend>
            <span>USW 12</span>
          </fieldset>

          <fieldset>
            <legend>Operator Name :</legend>
            <span>Anass Zeroual</span>
          </fieldset>
        </div>
        <div className={c["checklist"]}>
          <div className={c["Image"]}>
            {image && <img src={image} alt="Equipment" />}
            {points.map((p, i) => (
              <div
                onClick={() => getProblem(p.Num, p.Description)}
                className={
                  selectedPoints.some((point) => point.Num === p.Num)
                    ? c["selected"]
                    : c["dragedpoints"]
                }
                key={i}
                style={{
                  top: `${p.Position.y * 100}%`,
                  left: `${p.Position.x * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className={c["poin"]}>{p.Num}</span>
              </div>
            ))}
          </div>

          <div className={c["Points"]}>
            <div>
              {points.map((point, i) => (
                <div
                  key={i}
                  className={`${fadeIn ? c["fade-up"] : ""}`}
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  <span className={c["poin"]}>
                   
                    <p>{point.Num} </p>
                    <p> {point.Description}</p>
                  </span>
                </div>
              ))}
            </div>

            <div>
              <button onClick={submitCheckList}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Checklist;