import React, { useCallback, useEffect, useState } from "react";
import c from "../common/problem.module.css";
import axios from "axios";
import { message, Space, Switch } from "antd";
import api from "../../services/api";
import { getExactdate } from "../functions/utilitis";
import { useSelector } from "react-redux";
import Select from "../UI/SelectDropdown";

const CheckLists = () => {
  const User = useSelector((st) => st.login.isLoged);
  const [data, setdata] = useState([]);
  const [isChecked, setIsChecked] = useState(true);

  const [fdata, setfdata] = useState([]);

  const GetData = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/CheckList/Getall`);
      setdata(res.data);
      return res.data;
    } catch (err) {
      message.error(err.message);
    }
  }, []);
  useEffect(() => {
    GetData();
  }, [GetData]);

  const filteredPoints = [];

  data.map((d) => {
    d.points.map((p) => {
      if (p.status === "NOK") {
        filteredPoints.push(p);
      }
    });
  });

  console.log(filteredPoints);

  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
    setfdata(filteredPoints);
    message.info(`Switch is ${checked ? "on" : "off"}`);
  };


  return (
    <>
      <div className={c.header}>
        <h3>M4 CheckLists</h3>
      </div>
      <div>
        <select>
          <option>Search by Project ... </option>
        </select>
        <select>
          <option>Search by Family ... </option>
        </select>
        <select>
          <option>Search by Post ... </option>
        </select>
        <Space direction="vertical">
          <Switch
            checkedChildren="on"
            unCheckedChildren="off"
            defaultChecked
            onChange={handleSwitchChange}
            style={{
              backgroundColor: isChecked ? "#52c41a" : "orangered",
            }}
          />
        </Space>
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Project </th>
              <th>Family </th>
              <th>Post </th>
              <th>ID operator </th>
              <th>Equipement </th>
              <th>Item </th>
              <th> Date </th>
              <th>Shift </th>
              <th>Status </th>
              <th>Responsable Thechnician </th>

              <th>Action </th>
              <th>confirmation M </th>

              <th>Confirmation P</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) =>
              d.points.map((p, j) => (
                <React.Fragment key={`${i},${j}`}>
                  <tr>
                    <td>{d.project || "-"}</td>
                    <td>{d.family || "-"}</td>
                    <td>{d.post || "-"}</td>
                    <td>{d.OperatorID || "-"}</td>
                    <td>{d.equipment || "-"}</td>
                    <td>{p.Num || "-"}</td>
                    <td>{getExactdate(d.date) || "-"}</td>
                    <td>{d.shift || "-"}</td>
                    <td>{p.status || "-"}</td>

                    <td>
                      {p.status === "NOK" ? (
                        <>
                          {d.technicienDecision.length > 0 ? (
                            <>
                              {d.technicienDecision.map((t) =>
                                t.points.map((pt) =>
                                  pt.Num === p.Num ? <>{t.name}</> : <>-</>
                                )
                              )}
                            </>
                          ) : (
                            <>
                              <span style={{ color: "red" }}>
                                No thech checked yet
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <span> </span>
                        </>
                      )}
                    </td>

                    <td>
                      {p.status === "NOK" ? (
                        <>
                          {d.technicienDecision.length > 0 ? (
                            <>
                              {d.technicienDecision.map((t) =>
                                t.points.map((pt) =>
                                  pt.Num === p.Num ? (
                                    <>{pt.Action || "No Action Yet"}</>
                                  ) : (
                                    <>-</>
                                  )
                                )
                              )}
                            </>
                          ) : (
                            <>
                              <span style={{ color: "red" }}>
                                No Action Yet
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <span> </span>
                        </>
                      )}
                    </td>

                    <td>
                      {p.status === "NOK" ? (
                        <>
                          {d.technicienDecision.length > 0 ? (
                            <>
                              {d.technicienDecision.map((t) =>
                                t.points.map((pt) =>
                                  pt.Num === p.Num ? <>{pt.status}</> : <>-</>
                                )
                              )}
                            </>
                          ) : (
                            <>
                              <span style={{ color: "red" }}>
                                Not Checked yet
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <span> </span>
                        </>
                      )}
                    </td>

                    <td>
                      {p.status === "NOK" ? (
                        <>
                          {d.OperatornDecision.length > 0 ? (
                            <>
                              {d.OperatornDecision.map((t) =>
                                t.points.map((pt) =>
                                  pt.Num === p.Num ? <>{pt.status}</> : <>-</>
                                )
                              )}
                            </>
                          ) : (
                            <>
                              <span style={{ color: "red" }}>
                                Not Checked yet
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <span> </span>
                        </>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CheckLists;
