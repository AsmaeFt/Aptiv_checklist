import { useCallback, useEffect, useState } from "react";
import c from "./checklist.module.css";
import axios from "axios";
import api from "../../services/api";
import { getCurentdate, getShiftDate } from "../functions/utilitis";
import { message } from "antd";
import { getExactdate } from "../functions/utilitis";
const Checklist = ({ equip, currentIndex, handleNext, operatorInfo }) => {
  const [image, setImage] = useState("");
  const [points, setPoints] = useState([]);
  const [fadeIn, setFadeIn] = useState(false);
  const [data, setdata] = useState({});
  const [submit, setsubmit] = useState(false);
  const [allpoinsts, setallpoinsts] = useState([
    {
      Description: "",
      Num: "",
      status: "OK",
    },
  ]);
  const [show, setshow] = useState(false);

  useEffect(() => {
    if (equip) {
      if (equip.length > 1) {
        const dt = equip[currentIndex];
        setdata(dt);
        setImage(`http://10.236.148.30:8080/${dt.Pic}`);
        setPoints(dt.Points);
        const newPoints = dt.Points.map((p) => ({
          Description: p.Description,
          Num: p.Num,
          status: "OK",
        }));
        setallpoinsts(newPoints);
      } else {
        setdata(equip);
        setImage(`http://10.236.148.30:8080/${equip.Pic}`);
        setPoints(equip.Points);
        const newPoints = equip.Points.map((p) => ({
          Description: p.Description,
          Num: p.Num,
          status: "OK",
        }));
        setallpoinsts(newPoints);
      }
    }
  }, [equip, currentIndex]);
  useEffect(() => {
    setTimeout(() => {
      setFadeIn(true);
    }, 100);
  }, []);
  const getdate = new Date();
  const hours = getdate.getHours();
  const min = getdate.getMinutes();
  const Curent_Shift = getShiftDate(getdate);

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
    const point = allpoinsts.find((p) => p.Num === num);
    if (point) {
      return point.status === "OK" ? "green" : "red";
    }
    return "green";
  };

  const handleSave = async () => {
    const checkList_data = {
      OperatorID: operatorInfo.id,
      EquipmentName: data.Name,
      date: getdate,
      time: hours + ":" + min,
      shift: Curent_Shift.shift,
      project: operatorInfo.project,
      family: operatorInfo.family,
      post: operatorInfo.post,
      ref: data.ref,
      points: allpoinsts,
      flag: "checked",
    };
    if (currentIndex === equip.length - 1) {
      checkList_data.flag = "checked";
    }
    console.log(JSON.stringify(checkList_data, null, 2));

    try {
      const res = await axios.post(
        `${api}/CheckList/NewCheckList`,
        checkList_data
      );
      const data = res.data;
      message.success("technician will soon verify with you !");
      setsubmit(true);

      return data;
    } catch (err) {
      message.error(err.message);
    }
  };

  const [problems, setproblems] = useState([]);

  const fetchProblems = useCallback(async () => {
    const res = await axios.get(`${api}/CheckList/GetProblems`);
    const data = res.data;
    const prob = data.filter((p) => p.Id_Operator === operatorInfo.id);
    setproblems(prob);
  }, [operatorInfo]);
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const check = (num, name) => {
    for (const p of problems) {
      for (const m of p.technicienDecision) {
        for (const c of m.points) {
          if (c.Num === num && p.nameequipe === name) {
            return c.status;
          }
        }
      }
    }
    return "not Aproved yet";
  };

  const approve_oper = async (id, num) => {
    const data = {
      Id_CheckList: id,
      OperatorID: operatorInfo.id,
      Num: num,
      status: "Aproved",
    };
    console.log(JSON.stringify(data));
    try {
      const res = await axios.post(`${api}/CheckList/Aprove_Oper`, data);
      message.success("Approved successfully");
      return res.data;
    } catch (err) {
      message.error("Error ... ");
      console.error(err);
    }
  };

  const handleClick = (e) => {
    handleNext();
    setsubmit(false);
  };

  const checkFlag = useCallback(() => {
    const hasCheckedEquipment = problems.some(
      (p) =>
        p.nameequipe === data.Name &&
        p.flag === "checked" &&
        getExactdate(p.date) === getCurentdate(new Date())
    );
    console.log(hasCheckedEquipment);
    setshow(hasCheckedEquipment);
  }, [data, problems]);
  
  useEffect(() => {
    checkFlag();
  }, [checkFlag]);

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
              <span>{data && data.ref}</span>
            </fieldset>
          </div>
        </div>

        <div className={c["Header2-Checklist"]}>
          <fieldset>
            <legend>Project :</legend>
            <span>{operatorInfo.project}</span>
          </fieldset>

          <fieldset>
            <legend>FAMILY :</legend>
            <span>{operatorInfo.family}</span>
          </fieldset>
          <fieldset>
            <legend>STATION :</legend>
            <span>{operatorInfo.post}</span>
          </fieldset>

          <fieldset>
            <legend>CREW :</legend>
            <span>{operatorInfo.crew}</span>
          </fieldset>

          <fieldset>
            <legend>Operator Name :</legend>
            <span>{operatorInfo.name}</span>
          </fieldset>
        </div>

        {!show && (
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
                  <span>{p.Num}</span>
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
                    <div className={c["poin"]}>
                      <span className={c.taskNum}>{point.Num} </span>
                      <p> {point.Description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "2rem",
                }}
              >
                <button className="button" onClick={handleSave}>
                  Submit
                </button>
                {equip.length > 1 && submit && (
                  <button className="button" onClick={handleClick}>
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {problems.length > 0 && (
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Item </th>
                  <th>Equipement</th>
                  <th>Date </th>
                  <th>Shift </th>
                  <th>Maintenance</th>
                  <th>Production</th>
                </tr>
              </thead>

              <tbody>
                {problems.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div>{p.Num}</div>
                    </td>
                    <td>{p.nameequipe}</td>
                    <td>{getExactdate(p.date)}</td>
                    <td>{p.shift}</td>
                    <td>{check(p.Num, p.nameequipe)}</td> 
                    <td>
                      <button
                        style={
                          check(p.Num, p.nameequipe) !== "Aproved"
                            ? { backgroundColor: "gray", pointerEvents: "none" }
                            : {}
                        }
                        className="button"
                        onClick={() => {
                          approve_oper(p.Id_Checklist, p.Num);
                        }}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
export default Checklist;
