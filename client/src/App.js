import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Login from "./components/Login/LoginComponent";
import Header from "./Layout/Header/HeaderComponent";
import Footer from "./Layout/Footer/FooterComponent";

import { useStateValue } from "./StateProvider";

import Admin from "./components/Admin/AdminComponent";
import Hotel from "./components/Hotel/HotelComponent";
import User from "./components/User/UserComponent";
import jwt from "jsonwebtoken";
import { actionTypes } from "./reducer";
import LoadingSpinner from "./components/UI/Spinners/LoadingSpinner";
import { authenticateUserWithToken } from "./api_requests/auth_requests";
import ErrorComponent from "./components/Error/Error";

import "./App.css";
import { getCookie } from "./Helpers/Functions/functions";

const App = () => {
  const [state, dispatch] = useStateValue();
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    var fact = true;
    const exec = async () => {
      var isExpired = false;
      var isRefreshExpired = false;

      var accessToken = localStorage.getItem("token");
      var refreshToken = localStorage.getItem("rToken");

      // var xxx = getCookie("refresh-token");
      // console.log(xxx);

      if (!accessToken || !refreshToken) {
        return;
      }
      var decodedToken = jwt.decode(accessToken, { complete: true });
      var decodedRefreshToken = jwt.decode(refreshToken, {
        complete: true,
      });
      var dateNow = new Date();

      if (decodedToken.payload.exp * 1000 < dateNow.getTime()) isExpired = true;
      if (decodedRefreshToken.payload.exp * 1000 < dateNow.getTime())
        isRefreshExpired = true;

      if (!isExpired) {
        authenticateUserWithToken(
          decodedToken.payload.username,
          decodedToken.payload.password
        )
          .then(({ user, accessToken, refreshToken }) => {
            if (user.length === 0) {
              // setSubmitError(true);
            } else {
              localStorage.setItem("token", accessToken);
              localStorage.setItem("rToken", refreshToken);
              dispatch({
                type: actionTypes.SET_USER,
                user: user,
                authenticated: true,
                token: accessToken,
                rToken: refreshToken,
              });
            }
          })
          .then(() => {
            setIsSpinnerLoading(false);
          })
          .catch((err) => {
            // setSubmitError(true);
            // setIsButtonSpinnerLoading(false);
          });
      }
    };
    // exec();
    return () => {
      fact = false;
    };
  }, [state.token]);

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
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
