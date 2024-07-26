import { useCallback, useEffect, useState } from "react";
import c from "./Layout.module.css";
import axios from "axios";
import { message } from "antd";
import Empty from "../../assets/empty.png";
import Upload from "../../assets/icons8-upload-48.png";
import api from "../../services/api";
import { Add_Equipement } from "./Add_Equipement";
import Selectdropdown from "../UI/SelectDropdown";
import { OptionsFormat } from "../functions/utilitis";

const Layout = () => {
  const [data, setdata] = useState([]);
  const [maxEquipLength, setMaxEquipLength] = useState(0);

  /*   const [filterData, setfilterData] = useState(""); */

  const [project, setproject] = useState([]);
  const [family, setfamily] = useState([]);
  const [post, setpost] = useState([]);
  const [importData, setimportData] = useState(null);

  const [dataF, setDataF] = useState({
    p: [],
    f: [],
    po: [],
  });

  const GetLayout = useCallback(async () => {
    try {
      const res = await axios.get(`${api}/Layout/Getlayout`);
      const data = res.data;
      setdata(data);

      const maxEquipLength = Math.max(...data.map((p) => p.Equipement.length));
      setMaxEquipLength(maxEquipLength);

      const pr = [...new Set(data.map((p) => p.project))];
      setproject(pr);

      const fm = [...new Set(data.map((p) => p.family))];
      setfamily(fm);

      const ps = [...new Set(data.map((p) => p.post))];
      setpost(ps);

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

  /*   const handleFilterChange = (e) => {
    setfilterData(e.target.value);
  }; */

  /*   const filteredData = data.filter(
    (p) =>
      p.project.toLowerCase().includes(filterData.toLowerCase()) ||
      p.family.toLowerCase().includes(filterData.toLowerCase()) ||
      p.post.toLowerCase().includes(filterData.toLowerCase()) ||
      p.Equipement.some((e) =>
        e.toLowerCase().includes(filterData.toLowerCase())
      )
  ); */

  const FilterData = data.filter((item) => {
    const projectMath = dataF.p.length === 0 || dataF.p.includes(item.project);
    const familyMatch = dataF.f.length === 0 || dataF.f.includes(item.family);
    const postMatch = dataF.po.length === 0 || dataF.po.includes(item.post);
    return projectMath && familyMatch && postMatch;
  });
  console.log(FilterData);

  const handleAddData = (e) => {
    setimportData(e.target.files[0]);
  };

  const addDataFile = async () => {
    if (!importData) return alert("please select a file first ! ");
    const formData = new FormData();
    formData.append("excelFile", importData);
    try {
      const res = await axios.post(`${api}/Layout/ImportExcel`, formData);
      const data = await res.data;

      console.log(data);
      GetLayout();
      message.success("Layout Data Added Succefuly !");
      return data;
    } catch (err) {
      
      message.error(err.response.data);
      console.error(err);
    }
  };

  console.log(data);
  return (
    <>
      <div className={c.container}>
        <div className={c.cont}>
          <div className={c.header}>
            <h3>M4 Layout</h3>
          </div>

          {/*  <div className={c.seach}>
            <input
              type="text"
              placeholder="Serach and filter"
              onChange={handleFilterChange}
            />
          </div> */}
          {/*   <SelectDropdown /> */}

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
          </div>

          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Family</th>
                  <th>Post</th>

                  <th colSpan={maxEquipLength}>Equipements</th>
                </tr>
              </thead>
              <tbody>
                {FilterData.map((p, i) => (
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
                    {maxEquipLength.length != 0 && (
                      <>
                        {Array(maxEquipLength - p.Equipement.length)
                          .fill("")
                          .map((_, i) => (
                            <td key={i + p.Equipement.length}>
                              <img className="icons" src={Empty} />
                            </td>
                          ))}
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <>
            <div className={c.uploadlayout}>
              <span>Upload Data</span>{" "}
              <label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleAddData}
                />
              </label>
              <button className="button" onClick={addDataFile}>
                Upload
                <img className="icons" src={Upload} />
              </button>
            </div>
          </>
        </div>
        {showpopup && (
          <Add_Equipement close={togglePopup} pr={pr} fm={fm} po={po} />
        )}
      </div>
    </>
  );
};
export default Layout;
