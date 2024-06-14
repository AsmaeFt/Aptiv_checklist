import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/aptiv-logo.png";
import { Link, useLocation } from "react-router-dom";
import c from "./layout.module.css";
import { useSelector, useDispatch } from "react-redux";
import { loginActions } from "../store/loginSlice";

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
                    <NavLink to="/main">View Problems</NavLink>
                  </li>

                  <li>
                    <NavLink to="/Dashboard">Dashboard</NavLink>
                  </li>

                  <li>
                    <NavLink to="/Equip">Add Equipment</NavLink>
                  </li>
                  <li>
                    <NavLink to="/Layout">Layout list</NavLink>
                  </li>
                </React.Fragment>
              )}
              <button className="button"
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
