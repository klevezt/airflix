import React, { useState } from "react";
import ShowDrinks from "./ShowDrinks";

import "./BarComponent.css";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";

const BarComponent = () => {
  const [isSpinnerLoading] = useState(false);

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && <ShowDrinks />}
    </>
  );
};

export default BarComponent;
