import React, { useCallback, useEffect, useState } from "react";
import c from "./problem.module.css";
import axios from "axios";
import { message } from "antd";
import api from "../../services/api";
import { getExactdate } from "../functions/utilitis";
import { useSelector } from "react-redux";

const Problems = () => {
  const User = useSelector((st) => st.login.isLoged);
  const [data, setdata] = useState([]);

  const [action, setaction] = useState("");
  const [dateAction, setdateAction] = useState("");
  const [datePrevu, setdatePrevu] = useState("");

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

  console.log(data);

  const handleChnage = (i, f, e) => {
    setRowData((p) => ({
      ...p,
      [i]: {
        ...p[i],
        [f]: e,
      },
    }));
  };

  const approve_main = async (id_checklist, Num) => {
    const rowDataForChecklist = rowData[id_checklist] || {};
    const techApproval = {
      Id_CheckList: id_checklist,
      userName: User.userName,
      Num: Num,
      Action: rowDataForChecklist.action || "",
      status: "Approved",
      Date_Action: rowDataForChecklist.dateAction || "",
      Date_Prevu: rowDataForChecklist.datePrevu || "",
    };
    console.log(JSON.stringify(techApproval));
   
  };

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
                      <input
                        type="date"
                        onChange={(e) =>
                          handleChnage(i, "Date_Prevu", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        onChange={(e) =>
                          handleChnage(i, "Date_Action", e.target.value)
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
                        handleChnage(i, "Action", e.target.value)
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
                      onClick={() => approve_main(p.Id_Checklist, p.Num)}
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
