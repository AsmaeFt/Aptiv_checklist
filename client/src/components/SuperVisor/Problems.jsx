import React, { useCallback, useEffect, useState } from "react";
import c from "../common/problem.module.css";
import axios from "axios";
import { message } from "antd";
import api from "../../services/api";
import { getExactdate } from "../functions/utilitis";
import { useSelector } from "react-redux";

const Problems = () => {
  const User = useSelector((st) => st.login.isLoged);
  const [data, setdata] = useState([]);

  const [rowData, setRowData] = useState({});

  const GetProblems = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/CheckList/GetProblems`);
      const data = res.data;
      setdata(data);
    } catch (err) {
      message.error(err.message);
    }
  }, []);

  useEffect(() => {
    GetProblems();
  }, [GetProblems]);

  const handleChnage = (i, f, e) => {
    setRowData((p) => ({
      ...p,
      [i]: {
        ...p[i],
        [f]: e,
      },
    }));
  };

  const approve_main = async (i, id_checklist, Num) => {
    let date_prevu = "";
    const checklist = data.find((d) => d.Id_Checklist === id_checklist);
    if (checklist && checklist.technicienDecision) {
      checklist.technicienDecision.forEach((techDecision) => {
        const point = techDecision.points.find((p) => p.Num === Num);
        if (point) {
          date_prevu = point.Date_Prevu;
        }
      });
    } else {
      date_prevu = "";
    }

    const r = rowData[Num] || {};
    const isActionComplete = r.Action && r.Date_Action;
    const isOnlyDatePrevuFilled = r.Date_Prevu && !r.Action && !r.Date_Action;

    if (!isActionComplete && !isOnlyDatePrevuFilled) {
      return message.error(
        "Please fill both Action and Date Action, or only Date Prevu"
      );
    }

    const techApproval = {
      Id_CheckList: id_checklist,
      userName: User.userName,
      Num: Num,
      Action: r.Action || "",
      status: isActionComplete ? "Aproved" : "pending",
      Date_Action: r.Date_Action || "",
      Date_Prevu: r.Date_Prevu || date_prevu,
    };
    console.log(JSON.stringify(techApproval));
    try {
      const res = await axios.post(`${api}/CheckList/Aprove_T`, techApproval);
      message.success(res.error);
    } catch (err) {
      console.error(err);
      message.error(err.response.data.error);
    }
  };
  console.log(rowData);

  return (
    <>
      <div className={c.header}>
        <h3>Plan d{"'"}action associe a la maintenance 1rer niveau</h3>
      </div>
      <div className="table">
        <table>
          <thead>
            {User.role === "supervisor" && (
              <tr>
                <th colSpan={4}>Zone </th>
                <th colSpan={4}>Problem </th>
                <th colSpan={3}>Maintenance </th>
                <th colSpan={1}>Operator </th>
              </tr>
            )}

            <tr>
              <th>Project </th>
              <th>Family </th>
              <th>Post </th>
              {User.role === "supervisor" && <th>ID operator </th>}
              <th>Equipement </th>
              <th>Item </th>

              <th> Date </th>
              <th>Shift </th>
              {User.role === "supervisor" && <th>Responsable Thechnician </th>}
              {User.role === "supervisor" && <th>confirmation </th>}

              {User.role === "technicien" && (
                <>
                  <th>Date Prevue </th>
                  <th>Date Reelle D{"'"}action </th>
                </>
              )}

              <th>Action </th>
              {User.role === "supervisor" && <th>confirmation </th>}

              {User.role === "technicien" && <th>confirmation </th>}
            </tr>
          </thead>

          <tbody>
            {data.flatMap((p, i) => (
              <tr key={i}>
                <td>{p.project}</td>
                <td>{p.family}</td>
                <td>{p.post}</td>
                {User.role === "supervisor" && <td>{p.Id_Operator}</td>}
                <td>{p.nameequipe}</td>
                <td>
                  <div>{p.Num}</div>
                </td>
                <td>{getExactdate(p.date)}</td>
                <td>{p.shift}</td>
                {User.role === "supervisor" && (
                  <React.Fragment>
                    <td>
                      {p.technicienDecision &&
                      p.technicienDecision.length > 0 ? (
                        p.technicienDecision.map((x, i) => (
                          <span key={i}>{x.name}</span>
                        ))
                      ) : (
                        <span>No Technician Checked yet</span>
                      )}
                    </td>
                    <td>
                      {p.technicienDecision &&
                      p.technicienDecision.length > 0 ? (
                        p.technicienDecision.flatMap((x, i) =>
                          x.points.map((k, m) => (
                            <span
                              style={{ color: "#4e7c88" }}
                              key={`${i}-${m}`}
                            >
                              {k.status}
                            </span>
                          ))
                        )
                      ) : (
                        <span style={{ color: "red" }}>Not Checked Yet</span>
                      )}
                    </td>
                  </React.Fragment>
                )}

                {User.role === "technicien" && (
                  <React.Fragment>
                    <td>
                      {p.technicienDecision &&
                      p.technicienDecision.length > 0 ? (
                        p.technicienDecision.flatMap((x, i) => {
                          const matchingPoints = x.points.filter(
                            (k) => k.Num === p.Num
                          );
                          return matchingPoints.length > 0 ? (
                            matchingPoints.map((k, m) => (
                              <span
                                style={{ color: "orangered" }}
                                key={`${i}-${m}`}
                              >
                                {getExactdate(k.Date_Prevu)}
                              </span>
                            ))
                          ) : (
                            <input
                              key={i}
                              type="date"
                              onChange={(e) =>
                                handleChnage(
                                  p.Num,
                                  "Date_Prevu",
                                  e.target.value
                                )
                              }
                            />
                          );
                        })
                      ) : (
                        <input
                          type="date"
                          onChange={(e) =>
                            handleChnage(p.Num, "Date_Prevu", e.target.value)
                          }
                        />
                      )}
                    </td>

                    <td>
                      <input
                        type="date"
                        onChange={(e) =>
                          handleChnage(p.Num, "Date_Action", e.target.value)
                        }
                      />
                    </td>
                  </React.Fragment>
                )}

                {User.role === "supervisor" ? (
                  <td>
                    {p.technicienDecision && p.technicienDecision.length > 0 ? (
                      p.technicienDecision.flatMap((x, i) =>
                        x.points.map((k, m) => (
                          <span key={`${i}-${m}`}>
                            {k.Action || "No action Token Yet"}
                          </span>
                        ))
                      )
                    ) : (
                      <span>No action Token Yet</span>
                    )}
                  </td>
                ) : (
                  <td>
                    <textarea
                      placeholder="Enter Your Action ..."
                      onChange={(e) =>
                        handleChnage(p.Num, "Action", e.target.value)
                      }
                    />
                  </td>
                )}

                {User.role === "supervisor" && (
                  <td>
                    {p.OperatornDecision && p.OperatornDecision.length > 0 ? (
                      p.technicienDecision.flatMap((x, i) =>
                        x.points.map((k, m) => (
                          <span key={`${i}-${m}`}>{k.status}</span>
                        ))
                      )
                    ) : (
                      <span style={{ color: "red" }}>Not Checked Yet</span>
                    )}
                  </td>
                )}
                {User.role === "technicien" && (
                  <td>
                    <button
                      className="button"
                      onClick={() => approve_main(i, p.Id_Checklist, p.Num)}
                    >
                      Aprove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default Problems;