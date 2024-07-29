import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/aptiv-logo.png";
/* import { Link, useLocation } from "react-router-dom"; */
import c from "./layout.module.css";
import { useSelector, useDispatch } from "react-redux";
import { loginActions } from "../store/loginSlice";
import prob from "../../assets/icons8-error-64.png";
import dashboard from "../../assets/icons8-chart-64.png";
import equips from "../../assets/icons8-machine-30.png";
import layout from "../../assets/icons8-layout-50.png";
import LogOut from "../../assets/icons8-log-out-64.png";
import User from "../../assets/User.png";
import Set from "../../assets/Settings.png";
import Plan from "../../assets/icons8-plan-50.png";
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
              {isAuthenticated.role === "supervisor" && (
                <React.Fragment>
                  <li>
                    <NavLink to="/main">
                      View Problems <img className="icons" src={prob} />
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/Dashboard">
                      Dashboard <img className="icons" src={dashboard} />{" "}
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/Equip">
                      Equipments <img className="icons" src={equips} />{" "}
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/Layout">
                      Layout <img className="icons" src={layout} />{" "}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/Manage_Thechnicians">
                      Manage Thechs <img className="icons" src={Plan} />{" "}
                    </NavLink>
                  </li>
                </React.Fragment>
              )}
              <li>
                <NavLink>
                  settings
                  <img className="icons" src={Set} />
                </NavLink>
              </li>
              <li className={c.User}>
                <span>{isAuthenticated.userName}</span>{" "}
                <img className="icons" src={User} />
              </li>
              <button
                title="Log Out"
                className={c.LogOut}
                onClick={() => {
                  dispatch(loginActions.logOut());
                }}
              >
                <img src={LogOut} />
              </button>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
export default NavBar;
