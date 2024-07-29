import { useState, useEffect } from "react";
import BackDrop from "../UI/BackDrop";
import c from "./Notification.module.css";
const Notification = ({ message }) => {
  const [visible, setvisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setvisible(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {visible && (
        <>
          <BackDrop />
          <div className={c.Notification}>{message}</div>
        </>
      )}
    </>
  );
};

export default Notification;
