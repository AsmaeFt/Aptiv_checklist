import React, { useCallback, useEffect, useState } from "react";
import c from "./Layout.module.css";
import axios from "axios";
import { message, Space, Switch } from "antd";
import api from "../../services/api";
import { getExactdate } from "../functions/utilitis";
import Selectdropdown from "../UI/SelectDropdown";
import { OptionsFormat } from "../functions/utilitis";

const CheckLists = () => {
  const [data, setdata] = useState([]);
  const [isChecked, setIsChecked] = useState(true);
  const [fdata, setfdata] = useState([]);

  const [project, setproject] = useState([]);
  const [family, setfamily] = useState([]);
  const [post, setpost] = useState([]);
  const [equip, setequip] = useState([]);

  const [dataF, setDataF] = useState({
    p: [],
    f: [],
    po: [],
    eq: [],
    sdate: "",
    edate: "",
  });

  const GetFiltredData = (data) => {
    return data
      .map((d) => ({
        ...d,
        points: d.points.filter((p) => p.status === "NOK"),
      }))
      .filter((d) => d.points.length > 0);
  };

  const GetData = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/CheckList/Getall`);
      const datas = res.data;
      setfdata(datas);
      setdata(GetFiltredData(datas));
      return res.data;
    } catch (err) {
      message.error(err.message);
    }
  }, []);

  useEffect(() => {
    GetData();
  }, [GetData]);

  useEffect(() => {
    const pr = [...new Set(data.map((p) => p.project))];
    setproject(pr);

    const fm = [...new Set(data.map((p) => p.family))];
    setfamily(fm);

    const ps = [...new Set(data.map((p) => p.post))];
    setpost(ps);

    const eq = [...new Set(data.map((p) => p.equipment))];
    setequip(eq);

  }, [data]);

  const handleSwitchChange = (c) => {
    setIsChecked(c);
    setdata(c ? GetFiltredData(fdata) : fdata);
    message.info(`Switch is ${c ? "on" : "off"}`);
  };

  const FilterData = data.filter((item) => {
    const projectMath = dataF.p.length === 0 || dataF.p.includes(item.project);
    const familyMatch = dataF.f.length === 0 || dataF.f.includes(item.family);
    const postMatch = dataF.po.length === 0 || dataF.po.includes(item.post);
    const EquiptMatch = dataF.eq.length === 0 || dataF.eq.includes(item.equipment);

    const sdateMatch = dataF.sdate === "" || dataF.sdate <= item.date;
    const edateMatch = dataF.edate === "" || dataF.edate >= item.date;
    return (
      projectMath &&
      familyMatch &&
      postMatch &&
      EquiptMatch &&
      sdateMatch &&
      edateMatch
    );
  });

  return (
    <>
      <div className={c.container}>
        <div className={c.cont}>
          <div className={c.header}>
            <h3>M4 CheckLists</h3>
          </div>
          <div className={c.date}>
            <form>
              <input
                type="date"
                name="start"
                onChange={(e) =>
                  setDataF((prev) => ({ ...prev, sdate: e.target.value }))
                }
              />
              <input
                type="date"
                name="end"
                min={dataF.sdate}
                onChange={(e) =>
                  setDataF((prev) => ({ ...prev, edate: e.target.value }))
                }
              />
            </form>
          </div>

          <div className={c.filterdata}>

            <Selectdropdown
              options={OptionsFormat(project)}
              placeholder={"select Project ..."}
              onChange={(e) => setDataF((prev) => ({ ...prev, p: e }))}
            />

            <Selectdropdown
              options={OptionsFormat(family)}
              placeholder={"select Family ..."}
              onChange={(e) => setDataF((prev) => ({ ...prev, f: e }))}
            />

            <Selectdropdown
              options={OptionsFormat(post)}
              placeholder={"select Post ..."}
              onChange={(e) => setDataF((prev) => ({ ...prev, po: e }))}
            />

            <Selectdropdown
              options={OptionsFormat(equip)}
              placeholder={"select Equipement ..."}
              onChange={(e) => setDataF((prev) => ({ ...prev, eq: e }))}
            />

            <Space direction="vertical">
              <Switch
                checkedChildren="on"
                unCheckedChildren="off"
                checked={isChecked}
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
                
                {FilterData.map((d, i) =>
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
                                    t.points.map(
                                      (pt) => pt.Num === p.Num && <>{t.name}</>
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
                          ) : p.status === "OK" ? (
                            <>
                              {d.technicienDecision.length > 0 && (
                                <>
                                  {d.technicienDecision.map((t) =>
                                    t.points.map(
                                      (pt) => pt.Num === p.Num && <>{t.name}</>
                                    )
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            <>-</>
                          )}
                        </td>

                        <td>
                          {p.status === "NOK" ? (
                            <>
                              {d.technicienDecision.length > 0 ? (
                                <>
                                  {d.technicienDecision.map((t) =>
                                    t.points.map(
                                      (pt) =>
                                        pt.Num === p.Num && (
                                          <>{pt.Action || "No Action Yet"}</>
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
                                      pt.Num === p.Num ? (
                                        <>{pt.status}</>
                                      ) : (
                                        <>-</>
                                      )
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
                                      pt.Num === p.Num ? (
                                        <>{pt.status}</>
                                      ) : (
                                        <>-</>
                                      )
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
        </div>
      </div>
    </>
  );
};

export default CheckLists;
