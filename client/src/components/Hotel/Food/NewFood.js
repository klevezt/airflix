import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { addFood } from "../../../api_requests/hotel_requests";

import ErrorComponent from "../../Error/Error";

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

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setIsSpinnerLoading(true);
    try {
      await addFood(
        newFoodName,
        newFoodType,
        newFoodImages,
        newFoodIngredients,
        newFoodSpecialFeatures,
        newFoodDescription,
        state.token
      );
      const food = await fetchFoodFromDB(state.token);
      // ---- Error Handler ---- //
      if (food.error) {
        setErrorMessage(food.error.msg);
        throw new Error(food.error.msg);
      }

      history.replace("/food/edit");
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  useEffect(() => {
    let controller = new AbortController();
    const exec = async () => {
      setIsSpinnerLoading(true);
      try {
        const data = fetchFoodTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setTableFoodTypeState(data);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error &&!isSpinnerLoading && (
        <AddNewFoodForm
          closeAddNewFoodForm={() => {
            history.replace("/food");
          }}
          handleAddNewFood={handleAddNewFood}
          tableFoodTypeState={tableFoodTypeState}
        />
      )}
    </>
  );
};

export default NewFood;
