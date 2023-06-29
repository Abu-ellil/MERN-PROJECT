import React, { useState, useEffect } from "react";
import './css.css'

const Notification = ({ message }) => {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (message) {
      setShowNotification(true);

      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  return (
    showNotification && (
      <div className="notification">
        <p>{message}</p>
      </div>
    )
  );
};

export default Notification;