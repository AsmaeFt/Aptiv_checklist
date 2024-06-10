import { useCallback, useEffect, useState } from "react";
import c from "./tech.module.css";
import axios from "axios";
import { message } from "antd";
import api from "../../services/api";
import React from "react";
import { getExactdate } from "../functions/utilitis";

import { useSelector  } from "react-redux";
import { loginActions } from "../store/loginSlice";

const Problem = () => {

  const User = useSelector((st) => st.login.isLoged);

  const [data, setdata] = useState([]);
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

  data.flatMap((p) => {
    console.log(p.Num);
  });
  return (
    <>
      <div className={c.container}>
        <div className={c.cont}>
          <div className={c.header}>
            <h3>Plan d{"'"}action associe a la maintenance 1rer niveau</h3>
          </div>
          <div className={c.table_problem}>
            <table>
              <thead>
                <tr>
                  <th colSpan={3}>Problem</th>
                  <th>Action</th>
                  <th>Responsable</th>
                  <th colSpan={2}>Confirmation</th>
                  <th>Status</th>
                  <th></th>
                </tr>

                <tr>
                  <th>Item </th>
                  <th>Date </th>
                  <th>Shift </th>
                  <th>Responsable </th>
                  <th>Action </th>
                  <th>Date Action </th>
                  <th>Maintenance</th>
                  <th>Production</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.flatMap((p, i) => (
                  <tr key={i}>
                    <td>
                      <div>{p.Num}</div>
                    </td>
                    <td>{getExactdate(p.date)}</td>
                    <td>{p.shift}</td>
                    <td> {User.userName}</td>
                    <td>
                      <textarea />
                    </td>
                  <td>
                    <input type="date" />
                  </td>
                    <td>
                      <button className="button">Aprove</button>
                    </td>
                    <td>
                      <button className="button">Aprove</button>
                    </td>
                    <td>
                      <label>Pending ... </label>
                    </td>
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
export default Problem;
