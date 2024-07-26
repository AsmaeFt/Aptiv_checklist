import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/aptiv-logo.png";
/* import { Link, useLocation } from "react-router-dom"; */
import c from "./layout.module.css";
import { useSelector, useDispatch } from "react-redux";
import { loginActions } from "../store/loginSlice";
import prob from "../../assets/icons8-error-64.png"
import dashboard from "../../assets/icons8-chart-64.png"
import equips from "../../assets/icons8-machine-30.png"
import layout from "../../assets/icons8-layout-50.png"

const NavBar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((st) => st.login.isLoged);

  return (
    <>
      <div className={c["navbar-container"]}>
        <div className={c.logo}>
          <NavLink to="/main">
            <img src={logo} alt="APTIV logo" />
          </NavLink>
        </div>
        {isAuthenticated.logedIn && (
          <div className={c.links}>
            <ul>
              <li>welcome {" " + isAuthenticated.userName}</li>
              {isAuthenticated.role === "supervisor" && (
                <React.Fragment>
                  <li>
                    <NavLink to="/main">View Problems <img className="icons" src={prob} /></NavLink>
                  </li>

                  <li>
                    <NavLink to="/Dashboard">Dashboard <img className="icons" src={dashboard} /> </NavLink>
                  </li>

                  <li>
                    <NavLink to="/Equip">Equipments <img className="icons" src={equips} /> </NavLink>
                  </li>

                  <li>
                    <NavLink to="/Layout">Layout <img className="icons" src={layout} /> </NavLink>
                  </li>
                </React.Fragment>
              )}
              <button
                className="button"
                onClick={() => {
                  dispatch(loginActions.logOut());
                }}
              >
                log out
              </button>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
export default NavBar;
