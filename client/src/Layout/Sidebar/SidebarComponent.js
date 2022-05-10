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
  LocalActivity,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useStateValue } from "../../StateProvider";
import "./SidebarComponent.css";
import LanguageSwitcher from "../../components/UI/LanguageSwitcher/LanguageSwitcher";

const SidebarComponent = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();

  return (
    <div className="left__sidebar">
      <ul className="sidebar__list">
        <li>
          <NavLink exact to="/" className="navigation__link">
            <Home />
            <h5> {t("sidebar_home")} </h5>
          </NavLink>
        </li>
        {state.authenticated && state.user.role === "Admin" && (
          <li>
            <NavLink exact to="/users" className="navigation__link">
              <Person />
              <h5> {t("sidebar_users")} </h5>
            </NavLink>
          </li>
        )}
        {state.authenticated && state.user.role === "Hotel" && (
          <li>
            <NavLink exact to="/customers" className="navigation__link">
              <Person />
              <h5> {t("sidebar_customers")} </h5>
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/info" className="navigation__link">
            <Info />
            <h5> {t("sidebar_info")} </h5>
          </NavLink>
        </li>
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
        <li className="accordion-li">
          <Accordion className="accordion-navigation-link">
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <LocalBar className="mr-10" />
              <h5> Bar </h5>
            </AccordionSummary>
            <AccordionDetails className="accordion-details">
              <NavLink exact to="/bar">
                <BurstMode className="mr-10" />
                Ποτά
              </NavLink>
              <NavLink exact to="/bar/edit">
                <Edit className="mr-10" />
                Επεξεργασία Ποτών
              </NavLink>
              <NavLink exact to="/bar/edit-drink-type">
                <EditOutlined className="mr-10" />
                Επεξεργασία Τύπου Ποτών
              </NavLink>
              <NavLink exact to="/bar/add">
                <Add className="mr-10" />
                Προσθήκη Ποτού
              </NavLink>
              <NavLink exact to="/bar/add-drink-type">
                <AddCircle className="mr-10" />
                Προσθήκη Τύπου Ποτού
              </NavLink>
            </AccordionDetails>
          </Accordion>
        </li>
        <li className="accordion-li">
          <Accordion className="accordion-navigation-link">
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Flatware className="mr-10" />
              <h5> À La Carte </h5>
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
                Προσεχής εκδηλώσεις
              </NavLink>
              <NavLink exact to="/events/add">
                <Add className="mr-10" />
                Προσθήκη Εκδήλωσης
              </NavLink>
            </AccordionDetails>
          </Accordion>
        </li>
        {state.authenticated && state.user.role === "Admin" && (
          <li>
            <NavLink exact to="/logs" className="navigation__link">
              <Receipt />
              <h5> Logs </h5>
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/services" className="navigation__link">
            <LocalActivity />
            <h5> {t("services")}</h5>
          </NavLink>
        </li>
        <li>
          <LanguageSwitcher />
        </li>
      </ul>
    </div>
  );
};

export default SidebarComponent;
