import React, { useCallback, useEffect, useState } from "react";
import c from "./Layout.module.css";
import axios from "axios";
import { message } from "antd";
import api from "../../services/api";

const Layout = () => {
  const [data, setdata] = useState([]);
  const [maxEquipLength, setMaxEquipLength] = useState(0);

  const GetLayout = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/Layout/Getlayout`);
      const data = res.data;
      setdata(data);

      const maxEquipLength = Math.max(...data.map((p) => p.Equipement.length));
      setMaxEquipLength(maxEquipLength);

      return data;
    } catch (err) {
      message.error(err);
    }
  }, []);

  useEffect(() => {
    GetLayout();
  }, [GetLayout]);

  const update = () => {};

  return (
    <>
      <div className={c.container}>
        <div className={c.cont}>
          <div className={c.header}>
            <h3>The Layout</h3>
          </div>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Family</th>
                  <th>Post</th>

                  <th colSpan={maxEquipLength}>Equipement</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => (
                  <tr key={i} onClick={update} style={{ cursor: "pointer" }}>
                    <td>{p.project}</td>
                    <td>{p.family}</td>
                    <td>{p.post}</td>
                    {p.Equipement.map((e, i) => (
                      <td key={i}>{e}</td>
                    ))}
                    {Array(maxEquipLength - p.Equipement.length)
                      .fill("")
                      .map((_, i) => (
                        <td key={i + p.Equipement.length}>-</td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
