import user from "../../assets/user.png";
import React, { useState } from "react";
import DropdownWindow from "./DropdownWindow";
import "./user.css";
const DropdownContainer = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button className="nav-btn drop" onClick={handleButtonClick}>
        <img src={user} alt="" />
      </button>
      <DropdownWindow isOpen={isOpen} onClose={handleClose} profile={profile} />
    </div>
  );
};

export default DropdownContainer;
