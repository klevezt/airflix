import React from "react";

import "./FooterComponent.css";
import AdSense from "react-adsense";


const Footer = () => {
  return (
    <>
      <AdSense.Google client="ca-pub-4210779179353314" slot="7806394673" />
      <div className="footer">
        © AirFlix {new Date().getFullYear()} - All Right Reserved
      </div>
    </>
  );
};

export default Footer;
