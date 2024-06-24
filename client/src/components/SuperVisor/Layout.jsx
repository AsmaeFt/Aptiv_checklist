import { useCallback, useEffect, useState } from "react";
import c from "./Layout.module.css";
import axios from "axios";
import { message, Select } from "antd";
import api from "../../services/api";
import { Add_Equipement } from "./Add_Equipement";

const Layout = () => {
  const [data, setdata] = useState([]);
  const [maxEquipLength, setMaxEquipLength] = useState(0);
  const [filterData, setfilterData] = useState("");

  const [project, setproject] = useState([]);
  const [family, setfamily] = useState([]);
  const [post, setpost] = useState([]);

  const GetLayout = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/Layout/Getlayout`);
      const data = res.data;
      setdata(data);

      const maxEquipLength = Math.max(...data.map((p) => p.Equipement.length));
      setMaxEquipLength(maxEquipLength);

      const pr = [...new Set(data.map((p) => p.project))];
      const prs = pr.map((e) => ({ value: e, label: e }));
      setproject(prs);

      const fm = [...new Set(data.map((p) => p.family))];
      const fms = fm.map((e) => ({ value: e, label: e }));
      setfamily(fms);

      const ps = [...new Set(data.map((p) => p.post))];
      const pss = ps.map((e) => ({ value: e, label: e }));
      setpost(pss);

      return data;
    } catch (err) {
      message.error(err);
    }
  }, []);

  useEffect(() => {
    GetLayout();
  }, [GetLayout]);

  const [showpopup, setshowpopup] = useState(false);
  const [pr, setpr] = useState("");
  const [fm, setfm] = useState("");
  const [po, setpo] = useState("");

  const update = (p, f, post) => {
    console.log({ p, f, post });
    setpr(p);
    setfm(f);
    setpo(post);
    setshowpopup(!showpopup);
  };

  const togglePopup = () => {
    setshowpopup((p) => !p);
  };
  const handleFilterChange = (e) => {
    setfilterData( e.target.value);
  };

  const filteredData = data.filter((p) => 
    p.project.toLowerCase().includes(filterData.toLowerCase()) ||
    p.family.toLowerCase().includes(filterData.toLowerCase()) ||
    p.post.toLowerCase().includes(filterData.toLowerCase()) ||
    p.Equipement.some(e => e.toLowerCase().includes(filterData.toLowerCase()))
  );

  console.log(filteredData);

  console.log(filteredData);

  return (
    <>
      <div className={c.container}>
        <div className={c.cont}>
          <div className={c.header}>
            <h3>M4 Layout</h3>
          </div>

          <div className={c.seach}>
            <input
              type="text"
              placeholder="Serach and filter"
              onChange={handleFilterChange}
            />
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
                {filteredData.map((p, i) => (
                  <tr
                    key={i}
                    onClick={() => {
                      update(p.project, p.family, p.post);
                    }}
                    style={{ cursor: "pointer" }}
                  >
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
        {showpopup && (
          <Add_Equipement close={togglePopup} pr={pr} fm={fm} po={po} />
        )}
      </div>
    </>
  );
};
export default Layout;
