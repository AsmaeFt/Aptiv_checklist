import { useCallback, useEffect, useState } from "react";
import c from "./Check.module.css";
import axios from "axios";
import api from "../../services/api";
import { Card, message } from "antd";
import { useParams } from "react-router-dom";
import CheckList from "./CheckList";

const Checklist = () => {
  const { id, nameoperator, project, family, post } = useParams();
  console.log(JSON.stringify({ id, nameoperator, project, family, post }));

  const [datas, setdatas] = useState([]);
  const [Fdata, setFdata] = useState({});

  const getEquip = useCallback(async () => {
    const OperatorInfo = {
      id: id,
      nameoperator: nameoperator,
      project: project,
      family: family,
      post: post,
    };
    try {
      const res = await axios.post(
        `${api}/Equipment/GetEquipement`,
        OperatorInfo
      );
      const data = res.data;
      setdatas(data);
      return data;
    } catch (err) {
      message.error(err.response.data.message);
      console.error(err);
    }
  }, [id, nameoperator, project, family, post]);

  useEffect(() => {
    getEquip();
  }, [getEquip]);

  const handleClick = (name) => {
    const fd = datas.filter((d) => d.Name === name);
    setFdata(fd);
  };
  return (
    <>
      {datas.length <= 0 ? (
        <div>Error ... </div>
      ) : datas.length === 1 ? (
        <div>Single item</div>
      ) : (
        <div className={c.cards}>
          {datas.map((data, i) => (
            <div
              key={i}
              onClick={() => {
                handleClick(data.Name);
              }}
            >
              <h2>{data.Name}</h2>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default Checklist;
