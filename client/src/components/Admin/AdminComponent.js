import React from "react";
import Sidebar from "../../Layout/Sidebar/SidebarComponent";
import Users from "./Users/UsersComponent";

import { useStateValue } from "../../StateProvider";

import "./AdminComponent.css";
import { Route } from "react-router";
import Settings from "./Settings/Settings";

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
                <Route exact path="/settings">
                  {state.authenticated && <Settings user={state.user} />}
                </Route>
                <Route exact path="/users">
                  <Users />
                </Route>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
