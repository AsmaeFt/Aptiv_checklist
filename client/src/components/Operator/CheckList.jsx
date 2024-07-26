import React, { useCallback, useEffect, useState } from "react";
import c from "./checklist.module.css";
import axios from "axios";
import api from "../../services/api";
import { getCurentdate, getShiftDate } from "../functions/utilitis";
import { message } from "antd";
import { getExactdate } from "../functions/utilitis";
import AlreadyCgecked from "../UI/AlreadyCgecked";
import Quote from "../../assets/quotation.png";
import Check from "../../assets/checklist.png";
import Car from "../../assets/carr.png";
import Crew from "../../assets/crew.png";
import User from "../../assets/User.png";
import Station from "../../assets/station.png";
import Submit from "../../assets/submit.png";
import Next from "../../assets/next.png";

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
  const [fch, setfch] = useState([]);
  const [showCh, setshowCh] = useState(true);

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

  const GetCheckList = useCallback(async () => {
    const OperatorID = operatorInfo.id;
    try {
      const res = await axios.post(`${api}/CheckList/GetChecklist`, {
        OperatorID,
      });

      setfch(res.data);
      return res.data;
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log("OperatorID not found");
      } else {
        console.error("Error fetching checklist:", err);
      }
      setfch([]);
      return [];
    }
  }, [operatorInfo.id]);

  useEffect(() => {
    GetCheckList();
  }, [GetCheckList]);

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

  const saveCheckList = async () => {
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
      message.success(
        "technician will soon verify with you in case if any problem detected!سيقوم فني الصيانة بالتحقق معك قريبًا في حال اكتشاف أي مشكلة!"
      );
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
    return "Not Aproved yet | لم تتم الموافقة بعد";
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
    setshow(hasCheckedEquipment);
  }, [data, problems]);

  useEffect(() => {
    checkFlag();
  }, [checkFlag]);

  useEffect(() => {
    const exist = fch.find(
      (p) =>
        p.shift === Curent_Shift.shift &&
        getExactdate(p.date) === getCurentdate(getdate)
    );
    exist ? setshowCh(false) : setshowCh(true);
  }, [Curent_Shift.shift, data.Name, fch, getdate]);

  console.log(problems);
  return (
    <>
      <div style={{ width: "100%" }}>
        <div className={c["Header-Checklist"]}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3>
              <span className={c.highlight}>Maintenance 1er Niveau</span> A
              Effectuer Par Les Opérateurs
            </h3>
            <img className="icons" src={Check} />
          </div>

          <div>
            <fieldset>
              <legend>
                Reference
                <img className="icons" src={Quote} />
              </legend>
              <span>{data && data.ref}</span>
            </fieldset>
          </div>
        </div>

        <div className={c["Header2-Checklist"]}>
          <fieldset>
            <legend>
              Project <img className="icons" src={Car} />
            </legend>
            <span>{operatorInfo.project}</span>
          </fieldset>

          <fieldset>
            <legend>
              Family <img className="icons" src={Car} />
            </legend>
            <span>{operatorInfo.family}</span>
          </fieldset>
          <fieldset>
            <legend>
              Station <img className="icons" src={Station} />
            </legend>
            <span>{operatorInfo.post}</span>
          </fieldset>

          <fieldset>
            <legend>
              Crew <img className="icons" src={Crew} />
            </legend>
            <span>{operatorInfo.crew}</span>
          </fieldset>

          <fieldset>
            <legend>
              Operator Name <img className="icons" src={User} />
            </legend>
            <span>{operatorInfo.name}</span>
          </fieldset>
        </div>

        {showCh ? (
          <div className={c["checklist"]}>
            <div className={c["Image"]}>
              {image && <img src={image} alt="Equipment" />}
              {points.map((p, i) => (
                <React.Fragment key={i}>
                  {p.Position && (
                    <React.Fragment>
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
                    </React.Fragment>
                  )}
                </React.Fragment>
              ))}
              {/* <div>
                <span>Observation</span>
                <textarea style={{width:'90%'}}/>
              </div> */}
            </div>

            <div className={c["Points"]}>
              <h3>
                EQUIPEMENT :
                <span style={{ color: "orangered" }}>{data.Name}</span>
              </h3>
              <div className={c.listPoints}>
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
                {!submit && (
                  <button className="button" onClick={saveCheckList}>
                    SUBMIT | تأكيد
                    <img className="icons" src={Submit} />
                  </button>
                )}
                {equip.length > 1 && submit && (
                  <button className="button" onClick={handleClick}>
                    Next | التالي
                    <img className="icons" src={Next} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>{problems.length === 0 && <AlreadyCgecked />}</>
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
