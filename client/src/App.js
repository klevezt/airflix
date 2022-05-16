import { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import Login from "./components/Login/LoginComponent";
import Header from "./Layout/Header/HeaderComponent";
import Footer from "./Layout/Footer/FooterComponent";

import { useStateValue } from "./StateProvider";

import Admin from "./components/Admin/AdminComponent";
import Hotel from "./components/Hotel/HotelComponent";
import User from "./components/User/UserComponent";

import "./App.css";

const App = () => {
  const [state] = useStateValue();

  useEffect(() => {
    var token = localStorage.getItem("token");
    if (token) checkLoginStatus(localStorage.getItem("rToken"));
    console.log("app js");
  }, []);

  const checkLoginStatus = (token) => {
    fetch(process.env.REACT_APP_SERVER_URL + "/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    }).then((response) => console.log(response));
  };

  return (
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
  );
};

export default App;
