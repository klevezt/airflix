import React from "react";
import "./ButtonLoadingSpinner.css";
const ButtonLoadingSpinner = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default ButtonLoadingSpinner;
