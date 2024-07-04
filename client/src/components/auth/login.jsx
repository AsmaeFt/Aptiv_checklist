import React, { useState } from "react";
import c from "./auth.module.css";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import { loginActions } from "../store/loginSlice";
import Overlay from "../layout/Overlay";
import axios from "axios";
import { message } from "antd";

const Auth = () => {
  const [Login, setLogin] = useState({
    userName: "",
    password: "",
  });

  const [err, seterr] = useState(false);
  const dispatch = useDispatch();

  const ClickHandler = async (e) => {
    e.preventDefault();
    if (Login.userName.trim() === "" || Login.password.trim() === "") {
      alert("please make sure all field not empty");
      return;
    }
    try {
      const res = await axios.post(`${api}/users/login`, Login);
      const data = res.data;
      console.log(data);
      dispatch(
        loginActions.logIn({
          role: data.user.role,
          userName: data.user.userName,
          token: data.token,
        })
      );
      message.success("successful Login");
    } catch (e) {
      seterr(true);
      console.error(e);
      message.error(e.message);
    }
  };

  return (
    <>
      <Overlay />
      <div className={c["Login-Form"]}>
        <div className={c["container"]} >
          <fieldset>
            <legend>Login</legend>
            <form onSubmit={ClickHandler}>
              <div className={c["user-container"]}>
                <input
                  type="text"
                  name="matricule"
                  placeholder="User Name"
                  className={c["username"]}
                  value={Login.userName}
                  onChange={(e) =>
                    setLogin((p) => ({ ...p, userName: e.target.value }))
                  }
                />
              </div>

              <div className={c["password-container"]}>
                <input
                  type="password"
                  name="password"
                  placeholder="User Password"
                  className={c["userpassword"]}
                  value={Login.password}
                  onChange={(e) =>
                    setLogin((p) => ({ ...p, password: e.target.value }))
                  }
                />
              </div>
              <button className={c["Login"]}>Submit</button>
            </form>
          </fieldset>
        </div>
      </div>
    </>
  );
};

export default Auth;
