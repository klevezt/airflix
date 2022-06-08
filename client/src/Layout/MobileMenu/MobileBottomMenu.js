import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Menu,
  LocalActivity,
  RestaurantMenu,
  LocalBar,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import MobileSidebarComponent from "../Sidebar/MobileSidebarComponent";

import "./MobileBottomMenu.css";

const MobileBottomMenu = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenMenu = () => {
    // document.body.style.overflow =
      // document.body.style.overflow === "hidden" ? "scroll" : "hidden";
    setIsMenuOpen((s) => !s);
  };

  const classIsMenuOpen = isMenuOpen ? "openedMenu" : "closedMenu";

  return (
    <div className={`mobile-bottom-wrapper ${classIsMenuOpen}`}>
      <div className="mobile-menu-overlay" onClick={handleOpenMenu}></div>
      <div id="myNav" className={`overlay ${classIsMenuOpen}`}>
        <div className="overlay-content">
          <MobileSidebarComponent handleOpenMenu={handleOpenMenu} />
        </div>
      </div>
      <ul className="mobile-bottom-list">
        <li>
          <NavLink exact to="/drinks">
            <LocalBar className="mobile-menu-icon" />
            <h5> {t("Ποτό")} </h5>
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/food">
            <RestaurantMenu className="mobile-menu-icon" />
            <h5> {t("Φαγητό")} </h5>
          </NavLink>
        </li>

        <li>
          <NavLink exact to="/">
            <Home className="mobile-menu-icon" />
            <h5> {t("sidebar_home")} </h5>
          </NavLink>
        </li>
        <li>
          <NavLink exact to="/services">
            <LocalActivity className="mobile-menu-icon" />
            <h5> {t("services")} </h5>
          </NavLink>
        </li>
        <li onClick={handleOpenMenu}>
          <Menu className="mobile-menu-icon" />
          <h5> {t("Μενού")} </h5>
        </li>
      </ul>
    </div>
  );
};

export default MobileBottomMenu;
