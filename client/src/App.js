import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import reactDom from "react-dom";

import Login from "./components/Login/LoginComponent";
import Header from "./Layout/Header/HeaderComponent";
import Footer from "./Layout/Footer/FooterComponent";

import { useStateValue } from "./StateProvider";

import Admin from "./components/Admin/AdminComponent";
import Hotel from "./components/Hotel/HotelComponent";
import User from "./components/User/UserComponent";

import { Fade, Backdrop, Modal } from "@mui/material";

import jwt from "jsonwebtoken";
import { actionTypes } from "./reducer";
import LoadingSpinner from "./components/UI/Spinners/LoadingSpinner";
import { authenticateUserWithRefreshToken } from "./api_requests/auth_requests";
import ErrorComponent from "./components/Error/Error";

import "./App.css";

const App = () => {
  const [state, dispatch] = useStateValue();
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(true);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      var isExpired = false;
      var isRefreshExpired = false;

      var accessToken = localStorage.getItem("token");
      var refreshToken = localStorage.getItem("rToken");

      if (
        !accessToken ||
        accessToken === "undefined" ||
        !refreshToken ||
        refreshToken === "undefined"
      ) {
        localStorage.clear();
        setIsSpinnerLoading(false);

        return dispatch({
          type: actionTypes.REMOVE_JWT_TOKEN,
          authenticated: false,
          token: "",
          refreshToken: "",
        });
      }
      var decodedToken = jwt.decode(accessToken, { complete: true });
      var decodedRefreshToken = jwt.decode(refreshToken, {
        complete: true,
      });
      var dateNow = new Date();

      if (decodedToken.payload.exp * 1000 < dateNow.getTime()) isExpired = true;
      if (decodedRefreshToken.payload.exp * 1000 < dateNow.getTime())
        isRefreshExpired = true;

      if (!isRefreshExpired) {
        try {
          const { user } = await authenticateUserWithRefreshToken(refreshToken);
          if (user?.length === 0) {
            // setSubmitError(true);
          } else {
            localStorage.setItem("token", accessToken);
            localStorage.setItem("rToken", refreshToken);
            setIsSpinnerLoading(false);

            dispatch({
              type: actionTypes.SET_USER,
              user: user,
              authenticated: true,
              token: accessToken,
              rToken: refreshToken,
            });
          }
        } catch (err) {
          setError(true);
        } finally {
          setIsSpinnerLoading(false);
        }
      } else {
        setIsSpinnerLoading(false);
      }
    };
    exec();
    return () => controller?.abort();
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setModalOpen(false);
      setIsSpinnerLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const modalRelogin = reactDom.createPortal(
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className="modalMenu relogin-wrapper"
      open={modalOpen}
      closeAfterTransition
      components={Backdrop}
      componentsProps={{
        Backdrop: {
          timeout: 500,
          style: {
            backgroundColor: "rgb(255 255 255 / 50%)",
          },
        },
      }}
    >
      <Fade in={modalOpen}>
        <div>
          <LoadingSpinner />
        </div>
      </Fade>
    </Modal>,
    document.getElementById("login-root")
  );

  return (
    <>
      {!error && isSpinnerLoading && modalRelogin}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <BrowserRouter>
          <Header />
          {!state.authenticated ? (
            <>
              <Route path="/" exact>
                <Login />
              </Route>
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </>
          ) : (
            <Switch>
              <Route path="/">
                {state.user.role === "Admin" && <Admin />}
                {state.user.role === "Hotel" && <Hotel />}
                {state.user.role === "Customer" && <User />}
              </Route>
            </Switch>
          )}
          <Footer />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
