import React from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { NavLink } from "react-router-dom";

const SidebarRow = (props) => {
  return (
    <li className="accordion-li">
      <Accordion className="accordion-navigation-link">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5a-content"
          id="panel5a-header"
        >
          {props.mainIcon}
          <h5> {props.mainTitle}</h5>
        </AccordionSummary>
        <AccordionDetails className="accordion-details">
          {props.links.map((link, i) => {
            return (
              <NavLink exact to={link.url} key={i}>
                {link.icon}
                {link.title}
              </NavLink>
            );
          })}
        </AccordionDetails>
      </Accordion>
    </li>
  );
};

export default SidebarRow;
