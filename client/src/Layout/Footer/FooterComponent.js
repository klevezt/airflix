import React from "react";

import "./FooterComponent.css";

const Footer = () => {
  return (
    <div className="footer">
      © AirFlix {new Date().getFullYear()} - All Right Reserved
    </div>
  );
};

export default Footer;
