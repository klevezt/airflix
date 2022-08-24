import React from "react";
import Sidebar from "../../Layout/Sidebar/SidebarComponent";
import Users from "./Users/UsersComponent";

import { useStateValue } from "../../StateProvider";

import "./AdminComponent.css";
import { Route, Switch } from "react-router";
import Settings from "./Settings/Settings";
import PageNotFound from "../404/PageNotFound";

const Admin = () => {
  const [state] = useStateValue();

  return (
    <div className="full__content">
      <div className="content">
        <Sidebar />
        <div className="main__content">
          <div className="container">
            {state.authenticated && state.user.role === "Admin" && (
              <div className="container admin-container">
                <Switch>
                  <Route exact path="/settings">
                    {state.authenticated && <Settings user={state.user} />}
                  </Route>
                  <Route exact path="/users">
                    <Users />
                  </Route>
                  <Route path="*">
                    <PageNotFound />
                  </Route>
                </Switch>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
