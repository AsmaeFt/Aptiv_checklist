import { useCallback, useEffect, useState } from "react";
import c from "./tech.module.css";
import axios from "axios";
import { message } from "antd";
import api from "../../services/api";
import { getExactdate } from "../functions/utilitis";
import { useSelector } from "react-redux";

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

  const [action, setaction] = useState("");
  const [dateAction, setdateAction] = useState("");
  const [datePrevu, setdatePrevu] = useState("");

  const approve_main = async (id_checklist , Num) => {
    if (action === "" || dateAction === "" || datePrevu === "") {
      return message.error("Fill all inputs ");
    } else {
      const techApprovment = {
        Id_CheckList: id_checklist,
        userName: User.userName,
        Num:Num,
        Action: action.value,
        status: "Aproved",
        Date_Action: dateAction.value,
        Date_Prevu: datePrevu.value,
      };
      console.log(JSON.stringify(techApprovment));
      try {
        const res = await axios.post(
          `${api}/CheckList/Aprove_tech`,
          techApprovment
        );
        message.success(res.error);
      } catch (err) {
        console.error(err);
        message.error(err.response.data.error);
      }
    }
  };

  console.log(data);

  return (
    <>
      <div className={c.container}>
        <div className={c.cont}>
          <div className={c.header}>
            <h3>Plan d{"'"}action associe a la maintenance 1rer niveau</h3>
          </div>
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th colSpan={3}>
                    Zone
                  </th>
                  <th colSpan={4}>
                    Problem
                  </th>
                  <th colSpan={5}>
                    Maintenance
                  </th>
                </tr>
                <tr>
                  <th>Project</th>
                  <th>Family</th>
                  <th>Post</th>

                  <th>Item </th>
                  <th>Equipement</th>
                  <th>Date </th>
                  <th>Shift </th>

                  <th>Responsable </th>
                  <th>Action </th>
                  <th>Date Prevu </th>
                  <th>Date Action </th>
                  <th>Approvement</th>
                  
                </tr>
              </thead>
              <tbody>
                {data.flatMap((p, i) => (
                  <tr key={i}>
                    <td>
                      {p.project}
                    </td>
                    <td>
                      {p.family}
                    </td>
                    <td>
                      {p.post}
                    </td>
                    <td>
                      <div>{p.Num}</div>
                    </td>
                    <td>
                      {p.nameequipe}
                    </td>
                    <td>{getExactdate(p.date)}</td>
                    <td>{p.shift}</td>
                    <td> {User.userName}</td>
                    <td>
                      <textarea
                        onChange={(e) =>
                          setaction((p) => ({ ...p, value: e.target.value }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        onChange={(e) =>
                          setdatePrevu((p) => ({ ...p, value: e.target.value }))
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        onChange={(e) =>
                          setdateAction((p) => ({
                            ...p,
                            value: e.target.value,
                          }))
                        }
                      />
                    </td>
                    <td>
                      
                      <button
                        className="button"
                        onClick={() => approve_main(p.Id_Checklist , p.Num)}
                      >
                        Aprove
                      </button>
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
