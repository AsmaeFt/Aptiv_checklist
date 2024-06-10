import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/layout/Navbar";
import LogIn from "./components/auth/login";

import Supervisor from "./components/routes/SuperVisor";
import Operator from "./components/routes/Operator";
import Techn from "./components/routes/Technicien";

import "./App.css";

function App() {
  const isAuthenticated = useSelector((st) => st.login.isLoged);

  return (
    <>
      <NavBar />
      <div className="App">
        <Routes>
          {/* Public route - accessible without login */}
          <Route path="/Operator" element={<Operator />} />

          {/* Protected routes - require login */}
          <Route
            path="/*"
            element={
              isAuthenticated.logedIn ? (
                isAuthenticated.role === "supervisor" ? (
                  <Supervisor />
                ) : isAuthenticated.role === "technicien" ? (
                  <Techn />
                ) : (
                  <Navigate replace to="/Operator" />
                )
              ) : (
                <LogIn />
              )
            }
          />
        </Routes>
      </div>
    </>
  );
}
export default App;