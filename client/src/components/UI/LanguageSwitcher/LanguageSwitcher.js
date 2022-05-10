import React from "react";
import i18next from "i18next";

import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const changeLanguage = (lng) => {
    i18next.changeLanguage(lng);
  };

  return (
    <div className="language-wrapper">
      <img
        src={`${process.env.REACT_APP_IMAGES_URL}/Images/Flags/greece.png`}
        alt="Greek flag"
        onClick={() => changeLanguage("el")}
      />
      <img
        src={`${process.env.REACT_APP_IMAGES_URL}/Images/Flags/united-kingdom.png`}
        alt="English flag"
        onClick={() => changeLanguage("en")}
      />
    </div>
  );
};

export default LanguageSwitcher;
