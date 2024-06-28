import { Suspense } from "react";
import { Navigate , Route , Routes } from "react-router-dom";
import Problem from "../SuperVisor//Problems";
import Dashboard from "../SuperVisor/Dashboard";

import Layout from "../SuperVisor/Layout";
import Equip from "../SuperVisor/Equipement"
import Check from "../SuperVisor/CheckLists"

const SuperVisor = () => {
  return (

<Suspense>
    <Routes>
        <Route index path="/" element={<Navigate replace to="/main"/>} />
        <Route path="*" element={<Navigate replace to="/main"/>}/>
        <Route exact path="/main" element={<Check/>} />
        <Route exact path="/Dashboard" element={<Dashboard/>} />
       {/*  <Route exact path="/Equipment" element={<Equipment/>} /> */}
        <Route exact path="/Equip" element={<Equip/>} />
        <Route exact path="/Layout" element={<Layout/>} />
    </Routes>
</Suspense>
);
};
export default SuperVisor;