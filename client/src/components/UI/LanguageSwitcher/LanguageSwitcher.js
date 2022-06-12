import React, { useState, useEffect } from "react";
import i18next from "i18next";
import { imageGetter } from "../../../Helpers/Const/constants";

import "./LanguageSwitcher.css";

const LanguageSwitcher = () => {
  const [greeceFlag, setGreeceFlag] = useState("");
  const [englishFlag, setEnglishFlag] = useState("");

  useEffect(() => {
    const exec = async () => {
      const { myArr: greeceResult } = await imageGetter(
        [{ image: "greece.png" }],
        "Flags/",
        true
      );
      
      const { myArr: englishResult } = await imageGetter(
        [{ image: "united-kingdom.png" }],
        "Flags/",
        true
      );
      setGreeceFlag(greeceResult[0].image);
      setEnglishFlag(englishResult[0].image);
    };
    exec();
  }, []);

  const changeLanguage = (lng) => {
    i18next.changeLanguage(lng);
  };

  return (
    <div className="language-wrapper">
      <img
        src={greeceFlag}
        alt="Greek flag"
        onClick={() => changeLanguage("el")}
      />
      <img
        src={englishFlag}
        alt="English flag"
        onClick={() => changeLanguage("en")}
      />
    </div>
  );
};

export default LanguageSwitcher;
