import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";

import Sidebar from "../../Layout/Sidebar/SidebarComponent";

import { useStateValue } from "../../StateProvider";
import Events from "./Events/EventsComponent";
import FoodLandingPage from "./Food/FoodLandingPage";
// import Settings from "./Settings/Settings";
import MobileBottomMenu from "../../Layout/MobileMenu/MobileBottomMenu";

import "./UserComponent.css";
import DrinksLandingPage from "./Drinks/DrinksLandingPage";
import DrinksDetailsPage from "./Drinks/DrinksDetailsPage";
import AlacarteLandingPage from "./Alacarte/AlacarteLandingPage";
import AlacarteDetailsPage from "./Alacarte/AlacarteDetailsPage";
import BuffetLandingPage from "./Food/BuffetLandingPage";
// import BuffetDetailsPage from "./Food/BuffetDetailsPage";
import ServicesLandingPage from "./Services/ServicesLandingPage";
import ServicesDetailsPage from "./Services/ServicesDetailsPage";
import Home from "./Home/Home";
import EventsAll from "./Events/EventsAll";
import EventsDetail from "./Events/EventsDetail";
import Info from "./Info/Info";
import { actionTypes } from "../../reducer";
import { Fade, Backdrop, Modal } from "@mui/material";
import reactDom from "react-dom";
// import IconButton from "../UI/Buttons/IconButton";
import { useTranslation } from "react-i18next";
import ErrorComponent from "../Error/Error";
import { checkTokenExpiration } from "../../Helpers/Functions/functions";

const User = () => {
  const [state, dispatch] = useStateValue();
  const [autoLoggout, setAutoLogout] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { t } = useTranslation();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const { isExpired, isRefreshExpired } = checkTokenExpiration(
          state.token,
          state.refreshToken
        );

        if (isExpired && !isRefreshExpired) {
          const dataaa = await fetch(
            process.env.REACT_APP_SERVER_URL + "/auth/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-access-token": state.refreshToken,
              },
            }
          ).then((data) => data.json());

          // ---- Error Handler ---- //
          if (dataaa.error) {
            setErrorMessage(dataaa.error.msg);
            throw new Error(dataaa.error.msg);
          }

          dispatch({
            type: actionTypes.SET_NEW_JWT_TOKEN,
            token: dataaa.accessToken,
          });
        } else if (isRefreshExpired) {
          // ---- Error Handler ---- //
          setErrorMessage(t("session_expired"));
          setError(true);
          setAutoLogout(true);
        }
      } catch (err) {
        setError(true);
      }
      //run every minute (milliseconds)
    }, 60000);

    return () => clearInterval(intervalId);
  }, [state.token, state.refreshToken, dispatch,t]);

  const handleClose = () => {
    setAutoLogout(false);
    dispatch({
      type: actionTypes.REMOVE_JWT_TOKEN,
      authenticated: false,
      token: "",
      refreshToken: "",
    });
    localStorage.clear();
  };

  const logoutModal = reactDom.createPortal(
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={"modalMenu"}
      open={autoLoggout}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={autoLoggout}>
        <div className="modalRate-container">
          <ErrorComponent
            errorMessage={errorMessage}
            loggout
            handleClose={handleClose}
          />
        </div>
      </Fade>
    </Modal>,
    document.getElementById("user-rate-app-root")
  );

  return (
    <>
      {error && logoutModal}

      <div className="full__content">
        <div className="content">
          <Sidebar />
          <div className="user main__content">
            <div className="container">
              {state.authenticated && state.user.role === "Customer" && (
                <div className="user-container text-center mb-80">
                  <Route exact path="/info">
                    {state.authenticated && <Info />}
                  </Route>
                  <Route exact path="/services">
                    {state.authenticated && (
                      <ServicesLandingPage user={state.user} />
                    )}
                  </Route>
                  <Route exact path="/services/:type/detail">
                    {state.authenticated && (
                      <ServicesDetailsPage />
                    )}
                  </Route>
                  {/* <Route exact path="/settings">
                  {state.authenticated && <Settings user={state.user} />}
                </Route> */}
                  <Route exact path="/food">
                    {state.authenticated && <FoodLandingPage />}
                  </Route>
                  <Route exact path="/buffet">
                    {state.authenticated && (
                      <BuffetLandingPage user={state.user} />
                    )}
                  </Route>
                  {/* <Route exact path="/buffet/:type/detail">
                  {state.authenticated && (
                    <div className="p-relative  d-flex">
                      <BuffetDetailsPage />
                    </div>
                  )}
                </Route> */}
                  <Route exact path="/alacarte">
                    {state.authenticated && (
                      <AlacarteLandingPage user={state.user} />
                    )}
                  </Route>
                  <Route exact path="/alacarte/:type/detail">
                    {state.authenticated && (
                      <div className="p-relative  d-flex">
                        <AlacarteDetailsPage user={state.user} />
                      </div>
                    )}
                  </Route>
                  <Route exact path="/drinks">
                    {state.authenticated && (
                      <DrinksLandingPage user={state.user} />
                    )}
                  </Route>
                  <Route exact path="/drinks/:type/detail">
                    {state.authenticated && (
                      <div className="p-relative  d-flex">
                        <DrinksDetailsPage user={state.user} />
                      </div>
                    )}
                  </Route>
                  <Route exact path="/events">
                    {state.authenticated && <Events user={state.user} />}
                  </Route>
                  <Route exact path="/events/all">
                    {state.authenticated && <EventsAll user={state.user} />}
                  </Route>
                  <Route exact path="/events/view/:eventAlias">
                    {state.authenticated && <EventsDetail user={state.user} />}
                  </Route>
                  <Route exact path="/">
                    {state.authenticated && <Home user={state.user} />}
                  </Route>
                </div>
              )}
            </div>
            <MobileBottomMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
