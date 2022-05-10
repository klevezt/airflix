import React, { useState } from "react";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";

import ShowAlacarte from "./ShowAlacarte";

const Alacarte = () => {
  const [isSpinnerLoading] = useState(false);

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && <ShowAlacarte />}
    </>
  );
};

export default Alacarte;
