import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { addFood } from "../../../api_requests/hotel_requests";

import {
  fetchFoodFromDB,
  fetchFoodTypesFromDB,
} from "../../../api_requests/hotel_requests";

import AddNewFoodForm from "../Forms/Food/AddNewFood";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const NewFood = () => {
  const [state] = useStateValue();
  const [tableFoodTypeState, setTableFoodTypeState] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  let history = useHistory();

  const handleAddNewFood = async (
    e,
    newFoodName,
    newFoodType,
    newFoodImages,
    newFoodIngredients,
    newFoodSpecialFeatures,
    newFoodDescription
  ) => {
    e.preventDefault();
    console.log(newFoodSpecialFeatures);
    setIsSpinnerLoading(true);
    await addFood(
      newFoodName,
      newFoodType,
      newFoodImages,
      newFoodIngredients,
      newFoodSpecialFeatures,
      newFoodDescription,
      state.token
    );
    await fetchFoodFromDB(state.token).then((food) => {
      history.replace("/food/edit");
      setIsSpinnerLoading(false);
    });
  };

  useEffect(() => {
    setIsSpinnerLoading(true);
    fetchFoodTypesFromDB(state.token).then((data) => {
      setTableFoodTypeState(data);
      setIsSpinnerLoading(false);
    });
  }, []);

  return (
    <>
      {!isSpinnerLoading && (
        <AddNewFoodForm
          closeAddNewFoodForm={() => {
            history.replace("/food");
          }}
          handleAddNewFood={handleAddNewFood}
          tableFoodTypeState={tableFoodTypeState}
        />
      )}

      {isSpinnerLoading && <LoadingSpinner />}
    </>
  );
};

export default NewFood;
