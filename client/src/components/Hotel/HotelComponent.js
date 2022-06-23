import React from "react";
import { Route } from "react-router-dom";

import Sidebar from "../../Layout/Sidebar/SidebarComponent";
import Bar from "./Bar/BarComponent";

import { useStateValue } from "../../StateProvider";

import Food from "./Food/FoodComponent";
import NewFood from "./Food/NewFood";
import EditDrink from "./Bar/EditDrink";
import AddNewDrinkType from "./Forms/Drinks/AddNewDrinkType";
import EditFood from "./Food/EditFood";
import EditFoodType from "./Food/EditFoodType";
import EditDrinkType from "./Bar/EditDrinkType";

import "./HotelComponent.css";
import NewFoodType from "./Food/NewFoodType";
import AddNewDrink from "./Forms/Drinks/AddNewDrink";
import DrinkDetails from "./Bar/DrinkDetails";
import Alacarte from "./A-La-Carte/Alacarte";
import AddNewFoodAlacarte from "./Forms/Alacarte/AddNewFoodAlacarte";
import AlacarteDetails from "./A-La-Carte/AlacarteDetails";
import AddNewFoodTypeFormAlacarte from "./Forms/Alacarte/AddNewFoodTypeAlacarte";
import EditFoodTypeAlacarte from "./A-La-Carte/EditFoodTypeAlacarte";
import EditFoodAlacarte from "./A-La-Carte/EditFoodAlacarte";
import Staff from "./Staff/Staff";
import AddNewStaff from "./Forms/Staff/AddNewStaff";
import AddNewStaffPosition from "./Forms/Staff/AddNewStaffPosition";
import Settings from "./Settings/Settings";
import Events from "./Events/EventsComponent";
import AddNewEvent from "./Forms/Events/AddNewEvent";
import Customers from "./Customer/CustomersComponent";
import Info from "./Info/InfoComponent";
import AddNewInfo from "./Forms/Info/AddNewInfo";
import EventsAll from "./Events/EventsAll";
import InfoDetails from "./Info/InfoDetails";
import Services from "./Services/ServicesComponent";
import AddNewService from "./Forms/Services/AddNewService";
import ServicesDetails from "./Services/ServicesDetails";
import AddNewServiceType from "./Forms/Services/AddNewServiceType";
import EventEdit from "./Forms/Events/EditEvent";
import Home from "./Home/Home";

const Hotel = () => {
  const [state] = useStateValue();

  return (
    <div className="full__content">
      <div className="content">
        <Sidebar />
        <div className="main__content">
          <div className="container hotel-container">
            <Route exact path="/settings">
              {state.authenticated && <Settings user={state.user} />}
            </Route>
            <Route exact path="/services">
              {state.authenticated && <Services />}
            </Route>
            <Route exact path="/serviceType/add">
              {state.authenticated && <AddNewServiceType />}
            </Route>
            <Route exact path="/services/add">
              {state.authenticated && <AddNewService />}
            </Route>
            <Route exact path="/services/view/:alias">
              {state.authenticated && <ServicesDetails />}
            </Route>
            <Route exact path="/info">
              {state.authenticated && <Info />}
            </Route>
            <Route exact path="/info/add">
              {state.authenticated && <AddNewInfo />}
            </Route>
            <Route exact path="/info/view/:alias">
              {state.authenticated && <InfoDetails />}
            </Route>
            <Route exact path="/customers">
              {state.authenticated && <Customers />}
            </Route>
            <Route exact path="/food/menu">
              {state.authenticated && <Food />}
            </Route>
            <Route exact path="/food/add">
              {state.authenticated && <NewFood />}
            </Route>
            <Route exact path="/food/add-food-type">
              {state.authenticated && <NewFoodType />}
            </Route>
            <Route exact path="/food/edit">
              <EditFood />
            </Route>
            <Route exact path="/food/edit-food-type">
              <EditFoodType />
            </Route>
            <Route exact path="/bar">
              {state.authenticated && <Bar />}
            </Route>
            <Route exact path="/bar/drink/:drinkAlias">
              {state.authenticated && <DrinkDetails />}
            </Route>
            <Route exact path="/bar/add">
              <AddNewDrink />
            </Route>
            <Route exact path="/bar/add-drink-type">
              <AddNewDrinkType />
            </Route>
            <Route exact path="/bar/edit">
              <EditDrink />
            </Route>
            <Route exact path="/bar/edit-drink-type">
              <EditDrinkType />
            </Route>
            <Route exact path="/alacarte">
              {state.authenticated && <Alacarte />}
            </Route>
            <Route exact path="/alacarte/edit">
              <EditFoodAlacarte />
            </Route>
            <Route exact path="/alacarte/edit-food-type">
              <EditFoodTypeAlacarte />
            </Route>
            <Route exact path="/alacarte/add">
              {state.authenticated && <AddNewFoodAlacarte />}
            </Route>
            <Route exact path="/alacarte/food/:alacarteAlias">
              {state.authenticated && <AlacarteDetails />}
            </Route>
            <Route exact path="/alacarte/add-food-type">
              {state.authenticated && <AddNewFoodTypeFormAlacarte />}
            </Route>
            <Route exact path="/staff">
              {state.authenticated && <Staff />}
            </Route>
            <Route exact path="/staff/add">
              {state.authenticated && <AddNewStaff />}
            </Route>
            <Route exact path="/staff/add-employee-position">
              {state.authenticated && <AddNewStaffPosition />}
            </Route>
            <Route exact path="/events">
              {state.authenticated && <Events />}
            </Route>
            <Route exact path="/events/edit/:eventAlias">
              {state.authenticated && <EventEdit />}
            </Route>
            <Route exact path="/events/all">
              {state.authenticated && <EventsAll />}
            </Route>
            <Route exact path="/events/add">
              {state.authenticated && <AddNewEvent />}
            </Route>
            <Route exact path="/">
              {state.authenticated && <Home />}
            </Route>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;
