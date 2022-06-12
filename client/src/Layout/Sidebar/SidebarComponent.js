import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  RestaurantMenu,
  LocalBar,
  Info,
  Person,
  Receipt,
  ListAlt,
  Add,
  Edit,
  AddCircle,
  EditOutlined,
  BurstMode,
  Flatware,
  DateRange,
  EventNote,
  ExpandMore,
  Event,
  ExitToApp,
  LocalActivity,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useStateValue } from "../../StateProvider";
import "./SidebarComponent.css";
import LanguageSwitcher from "../../components/UI/LanguageSwitcher/LanguageSwitcher";
import { actionTypes } from "../../reducer";

const SidebarComponent = () => {
  const [state,dispatch] = useStateValue();
  const { t } = useTranslation();

  const AUTHENTICATED = state.authenticated;

  const ADMIN_ROLE = AUTHENTICATED && state.user.role === "Admin";
  const HOTEL_ROLE = AUTHENTICATED && state.user.role === "Hotel";
  const USER_ROLE = AUTHENTICATED && state.user.role === "Customer";

  const logoutHandler = () => {
    localStorage.clear();

    dispatch({
      type: actionTypes.REMOVE_JWT_TOKEN,
      authenticated: false,
      token: "",
    });
  };

  return (
    <div
      className={`left__sidebar ${
        state.user.role === "Customer" && "customer"
      }`}
    >
      <ul className="sidebar__list">
        <li>
          <NavLink exact to="/" className="navigation__link">
            <Home />
            <h5> {t("sidebar_home")} </h5>
          </NavLink>
        </li>

        {ADMIN_ROLE && (
          <li>
            <NavLink exact to="/users" className="navigation__link">
              <Person />
              <h5> {t("sidebar_users")} </h5>
            </NavLink>
          </li>
        )}

        {AUTHENTICATED && (
          <li>
            <NavLink to="/services" className="navigation__link">
              <LocalActivity />
              <h5> {t("services")}</h5>
            </NavLink>
          </li>
        )}

        {HOTEL_ROLE && (
          <li>
            <NavLink exact to="/customers" className="navigation__link">
              <Person />
              <h5> {t("sidebar_customers")} </h5>
            </NavLink>
          </li>
        )}

        {AUTHENTICATED && (
          <li>
            <NavLink to="/info" className="navigation__link">
              <Info />
              <h5> {t("sidebar_info")} </h5>
            </NavLink>
          </li>
        )}

        {USER_ROLE && (
          <li>
            <NavLink exact to="/food" className="navigation__link">
              <RestaurantMenu />
              <h5>{t("sidebar_food")}</h5>
            </NavLink>
          </li>
        )}

        {USER_ROLE && (
          <li>
            <NavLink exact to="/drinks" className="navigation__link">
              <LocalBar />
              <h5>{t("sidebar_drinks")}</h5>
            </NavLink>
          </li>
        )}

        {USER_ROLE && (
          <li>
            <NavLink exact to="/events" className="navigation__link">
              <DateRange />
              <h5>{t("sidebar_events")}</h5>
            </NavLink>
          </li>
        )}

        {HOTEL_ROLE && (
          <li className="accordion-li">
            <Accordion className="accordion-navigation-link">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <RestaurantMenu className="mr-10" />
                <h5> {t("sidebar_food")} </h5>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <NavLink exact to="/food">
                  <BurstMode className="mr-10" />
                  {t("sidebar_all_food")}
                </NavLink>
                <NavLink exact to="/food/menu">
                  <ListAlt className="mr-10" />
                  {t("sidebar_view_menu")}
                </NavLink>
                <NavLink exact to="/food/edit">
                  <Edit className="mr-10" />
                  {t("sidebar_edit_food")}
                </NavLink>
                <NavLink exact to="/food/edit-food-type">
                  <EditOutlined className="mr-10" />
                  {t("sidebar_edit_food_type")}
                </NavLink>
                <NavLink exact to="/food/add">
                  <Add className="mr-10" />
                  {t("sidebar_add_food")}
                </NavLink>
                <NavLink exact to="/food/add-food-type">
                  <AddCircle className="mr-10" />
                  {t("sidebar_add_food_type")}
                </NavLink>
              </AccordionDetails>
            </Accordion>
          </li>
        )}

        {HOTEL_ROLE && (
          <li className="accordion-li">
            <Accordion className="accordion-navigation-link">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <LocalBar className="mr-10" />
                <h5> {t("sidebar_bar")} </h5>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <NavLink exact to="/bar">
                  <BurstMode className="mr-10" />
                  {t("sidebar_drinks")}
                </NavLink>
                <NavLink exact to="/bar/edit">
                  <Edit className="mr-10" />
                  {t("edit_drinks")}
                </NavLink>
                <NavLink exact to="/bar/edit-drink-type">
                  <EditOutlined className="mr-10" />
                  {t("edit_drink_type")}
                </NavLink>
                <NavLink exact to="/bar/add">
                  <Add className="mr-10" />
                  {t("sidebar_add_drink")}
                </NavLink>
                <NavLink exact to="/bar/add-drink-type">
                  <AddCircle className="mr-10" />
                  {t("sidebar_add_drink_type")}
                </NavLink>
              </AccordionDetails>
            </Accordion>
          </li>
        )}

        {HOTEL_ROLE && (
          <li className="accordion-li">
            <Accordion className="accordion-navigation-link">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Flatware className="mr-10" />
                <h5> {t("sidebar_alacarte")} </h5>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <NavLink exact to="/alacarte">
                  <BurstMode className="mr-10" />à la carte - Φαγητά
                </NavLink>
                <NavLink exact to="/alacarte/edit">
                  <Edit className="mr-10" />à la carte - Επεξεργασία Φαγητών
                </NavLink>
                <NavLink exact to="/alacarte/edit-food-type">
                  <EditOutlined className="mr-10" />à la carte - Τύποι Φαγητών
                </NavLink>
                <NavLink exact to="/alacarte/add">
                  <Add className="mr-10" />à la carte - Προσθήκη Φαγητού
                </NavLink>
                <NavLink exact to="/alacarte/add-food-type">
                  <AddCircle className="mr-10" />à la carte - Προσθήκη Τύπου
                  Φαγητού
                </NavLink>
              </AccordionDetails>
            </Accordion>
          </li>
        )}

        {HOTEL_ROLE && (
          <li className="accordion-li">
            <Accordion className="accordion-navigation-link">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel5a-content"
                id="panel5a-header"
              >
                <DateRange className="mr-10" />
                <h5> {t("sidebar_events")} </h5>
              </AccordionSummary>
              <AccordionDetails className="accordion-details">
                <NavLink exact to="/events/all">
                  <Event className="mr-10" />
                  {t("all_events")}
                </NavLink>
                <NavLink exact to="/events">
                  <EventNote className="mr-10" />
                  {t("upcoming_events")}
                </NavLink>
                <NavLink exact to="/events/add">
                  <Add className="mr-10" />
                  {t("add_event")}
                </NavLink>
              </AccordionDetails>
            </Accordion>
          </li>
        )}

        {ADMIN_ROLE && (
          <li>
            <NavLink exact to="/logs" className="navigation__link">
              <Receipt />
              <h5> Logs </h5>
            </NavLink>
          </li>
        )}

        {USER_ROLE && (
          <li>
            <NavLink
              exact
              to="/"
              onClick={logoutHandler}
              className="navigation__link"
            >
              <ExitToApp />
              <h5>{t("logout")}</h5>
            </NavLink>
          </li>
        )}

        <li>
          <LanguageSwitcher />
        </li>
      </ul>
    </div>
  );
};

export default SidebarComponent;
