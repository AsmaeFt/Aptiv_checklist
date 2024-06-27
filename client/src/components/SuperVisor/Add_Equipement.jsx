import c from "./style.module.css";
import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import axios from "axios";
import api from "../../services/api";
import Selectdropdown from "../UI/SelectDropdown";
import { OptionsFormat } from "../functions/utilitis";

export const Add_Equipement = ({ close, pr, fm, po }) => {
  console.log({ pr, fm, po });

  const [equip, setequip] = useState("");
  const [listEquips, setlistEquips] = useState([]);
  const closepopup = (e) => {
    if (e.target.classList.contains(c.container)) {
      close();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (equip === "") {
      return message.error("the Fieald is empty");
    } else {
      try {
        const data = {
          project: pr,
          family: fm,
          post: po,
          Equipement: equip,
        };
        console.log(JSON.stringify(data));
        const res = await axios.post(`${api}/Layout/Update`, data);
        message.success("Equipement had been added successfuly");
        close();
        return res.data;
      } catch (err) {
        console.error(err);
      }
    }
  };

  const GetEquips = useCallback(async () => {
    const res = await axios.get(`${api}/Equipment/GetNames`);
    setlistEquips(res.data);
  }, []);
  useEffect(() => {
    GetEquips();
  }, [GetEquips]);

  console.log(equip);

  return (
    <div className={c.container} onClick={closepopup}>
      <div className={c.content}>
        <div className={c.header}>
          <h3>Add New Equipement </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Project </label>
          <input type="text" value={pr} disabled />
          <label>Family </label>
          <input type="text" value={fm} disabled />
          <label>Post </label>
          <input type="text" value={po} disabled />
          <label>New Equipement </label>

          <div>
            
          <Selectdropdown
              mode=""
              style={{ width: '100%' }}
              options={OptionsFormat(listEquips)}
              placeholder={"select Equipement ..."}
              onChange={(e) => {
                setequip(e);
                console.log("Selected project:", e);
              }}
            />
          </div>


          <div>
            <button className="button" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
