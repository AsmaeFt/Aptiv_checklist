import React, { Suspense } from "react";
import Checklist from "../Operator/Operator";

const Operator = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Checklist />
    </Suspense>
  );
};

export default Operator;
