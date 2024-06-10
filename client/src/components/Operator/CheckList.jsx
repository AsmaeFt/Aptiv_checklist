import { useCallback, useEffect, useState } from "react";
import c from "./checklist.module.css";
import axios from "axios";
import api from "../../services/api";
import { getShiftDate } from "../functions/utilitis";
import { message } from "antd";

const Checklist = () => {
  const [image, setImage] = useState("");
  const [points, setPoints] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [data, setdata] = useState(null);
  const [allpoinsts, setallpoinsts] = useState([
    {
      Description: "",
      Num: "",
      status: "OK",
    },
  ]);

  const GetEquipement = useCallback(async () => {
    try {
      const res = await axios.get(
        `${api}/Equipment/GetEquipenet?name=teste électrique`
      );
      const data = res.data;
      setImage(`http://localhost:8080/${data.Pic}`);
      setPoints(data.Points);
      setdata(data);

      const newPoints = data.Points.map((p) => ({
        Description: p.Description,
        Num: p.Num,
        status: "OK",
      }));
      setallpoinsts(newPoints);

      return data;
    } catch (err) {
      console.error(err);
    }
  }, []);
  useEffect(() => {
    GetEquipement();
  }, [GetEquipement]);


  console.log(allpoinsts);
  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
  }, []);

  const getdate = new Date();
  const Curent_Shift = getShiftDate(getdate);

  const submitCheckList = () => {
    const checkList_data = {
      /*  operatorID: "1023", */
      EquipmentName: "teste électrique",
      date: new Date(),
      shift: Curent_Shift.shift,
      project: "K9 KSK",
      family: "HAB",
      ref: data.ref,
      points: allpoinsts,
    };
    console.log(JSON.stringify(checkList_data, null, 2));
    message.success("technician will soon verify with you !");
  };

  const getProblem = (num) => {
    const Points = allpoinsts.map((p) => {
      if (p.Num === num) {
        return { ...p, status: p.status === "OK" ? "NOK" : "OK" };
      }
      return p;
    });
    setallpoinsts(Points);
  };

  const getColor = (num) => {
    const point = allpoinsts.find(p => p.Num === num);
    if (point) {
      return point.status === "OK" ? "green" : "red";
    }
    return "green";
  };
  const handleSave = async () => {
    const checkList_data = {
      /*  operatorID: "1023", */
      EquipmentName: "teste électrique",
      date: new Date(),
      shift: Curent_Shift.shift,
      project: "K9 KSK",
      family: "HAB",
      ref: data.ref,
      points: allpoinsts,
    };
    console.log(JSON.stringify(checkList_data, null, 2));

    try {
      const res = await axios.post(`${api}/CheckList/NewCheckList`,checkList_data);
      const data = res.data;
      message.success("technician will soon verify with you !");
      return data;
    } catch (err) {
      message.error(err.message);
    }
  };
  return (
    <>
      <div style={{ width: "100%" }}>
        <div className={c["Header-Checklist"]}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3>
              <span className={c.highlight}>Maintenance 1er Niveau</span> A
              Effectuer Par Les Opérateurs
            </h3>
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
                className={c["dragedpoints"]}
                key={i}
                style={{
                  top: `${p.Position.y * 100}%`,
                  left: `${p.Position.x * 100}%`,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: getColor(p.Num),
                 
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
                    <span className={c.taskNum}>{point.Num} </span>
                    <p> {point.Description}</p>
                  </span>
                </div>
              ))}
            </div>

            <div>
              <button onClick={handleSave}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Checklist;
