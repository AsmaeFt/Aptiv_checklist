import c from "./style.module.css";
import { useState } from "react";
import { message } from "antd";
import axios from "axios";
import api from "../../services/api";

export const Add_Equipement = ({ close, pr, fm, po }) => {
  console.log({ pr, fm, po });

  const [equip, setequip] = useState("");
  const closepopup = (e) => {
    if (e.target.classList.contains(c.container)) {
      close();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (equip.value === "") {
      return message.error("the Fieald is empty");
    } else {
      try {
        const data = {
          project: pr,
          family: fm,
          post: po,
          Equipement: equip.value,
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
          <input
            type="text"
            required
            onChange={(e) => {
              setequip((p) => ({ ...p, value: e.target.value }));
            }}
          />
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
