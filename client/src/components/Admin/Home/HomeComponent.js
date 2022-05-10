import React from "react";
import Header from "../Header/HeaderComponent";
import Footer from "../Footer/FooterComponent";

import "./HomeComponent.css";
import SidebarComponent from "../Sidebar/SidebarComponent";

function HomeComponent() {
  return (
    <div className="full__content">
      <Header />
      <div className="content">
        <SidebarComponent />
        <div className="main__content">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">First</th>
                <th scope="col">Last</th>
                <th scope="col">Handle</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td colspan="2">Larry the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomeComponent;
