import { Suspense } from "react";
import { Navigate , Route , Routes } from "react-router-dom";
import Problem from "../SuperVisor/Problems";
import Dashboard from "../SuperVisor/Dashboard";
import Equipment from "../SuperVisor/Equipment";

const SuperVisor = () => {
  return (

<Suspense>
    <Routes>
        <Route index path="/" element={<Navigate replace to="/main"/>} />
        <Route path="*" element={<Navigate replace to="/main"/>}/>
        <Route exact path="/main" element={<Problem/>} />
        <Route exact path="/Dashboard" element={<Dashboard/>} />
        <Route exact path="/Equipment" element={<Equipment/>} />
    </Routes>
</Suspense>
);
};
export default SuperVisor;