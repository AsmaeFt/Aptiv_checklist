import { Suspense } from "react";
import { Navigate , Route , Routes } from "react-router-dom";
import Problem from "../Technicien/Problem";

const Thecnicien = () => {
  return (

<Suspense>
    <Routes>
        <Route index path="/" element={<Navigate replace to="/main"/>} />
        <Route path="*" element={<Navigate replace to="/main"/>}/>
        <Route exact path="/main" element={<Problem/>} />
    </Routes>
</Suspense>
);
};
export default Thecnicien;