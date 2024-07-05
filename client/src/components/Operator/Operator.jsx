import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/api";
import { message } from "antd";
import { useParams } from "react-router-dom";
import CheckList from "./CheckList";
import { useNavigate } from "react-router-dom";
import err from "../../assets/error.svg";
import Good from "../UI/GreatJob";

const Checklist = () => {

  const [showGood, setShowGood] = useState(false);

  const navigate = useNavigate();
  const { id, nameoperator, project, family, post, crew } = useParams();
  const operatorInfo = {
    project: project,
    family: family,
    post: post,
    crew: crew,
    id: id,
    name: nameoperator,
  };
  /*  console.log(JSON.stringify({ id, nameoperator, project, family, post })); */
  const [datas, setdatas] = useState([]);
  const [index, setIndex] = useState(0);

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

  const handelnext = () => {
    if (index < datas.length - 1) {
      setIndex(index + 1);
      console.log(index);
      console.log(datas.length);
    } else {

        navigate("/dpo");
      }
    
  };
  console.log(datas);

  return (
    <>
      {datas.length <= 0 ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <img style={{ width: "30rem" }} src={err} />
            <p> No Project or Family Or Post or just no Data Found !</p>
          </div>
        </div>
      ) : datas.length === 1 ? (
        <CheckList equip={datas[0]} />
      ) : (
        <>
          <CheckList
            equip={datas}
            currentIndex={index}
            handleNext={handelnext}
            operatorInfo={operatorInfo}
          />
        </>
      )}
    </>
  );
};
export default Checklist;
