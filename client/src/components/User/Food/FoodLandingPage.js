import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RestaurantMenu, MenuBook } from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import "./FoodLandingPage.css";

function FoodLandingPage() {
  const { t } = useTranslation();

  const [openLeft, setOpenLeft] = useState(false);
  const [openRight, setOpenRight] = useState(false);

  const handleOpenRight = () => setOpenRight((s) => !s);

  const handleOpenLeft = () => {
    setOpenLeft((s) => !s);
  };

  return (
    <div className="drink-user-wrapper">
      <div
        className={`food-landing-page ${openLeft ? "openLeft" : ""} ${
          openRight ? "openRight" : ""
        } `}
      >
        <div
          className="d-flex justify-content-center align-items-center flex-direction-column"
          onClick={handleOpenLeft}
        >
          <Link to={"/buffet"}>
            <RestaurantMenu className="landing-page-icon" />
          </Link>
          <h2>MENU</h2>
        </div>
        <div
          className="d-flex justify-content-center align-items-center flex-direction-column"
          onClick={handleOpenRight}
        >
          <Link to={"/alacarte"}>
            <MenuBook className="landing-page-icon" />
          </Link>
          <h2>A LA CARTE</h2>
        </div>
      </div>
    </div>
  );
}

export default FoodLandingPage;
