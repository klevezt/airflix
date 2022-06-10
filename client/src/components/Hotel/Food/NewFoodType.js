import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import {
  addFoodType,
  fetchFoodTypesFromDB,
} from "../../../api_requests/hotel_requests";
import AddNewFoodTypeForm from "../Forms/Food/AddNewFoodType";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";
import ErrorComponent from "../../Error/Error";

const NewFood = () => {
  const [state] = useStateValue();
  const [tableFoodTypeState, setTableFoodTypeState] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  let history = useHistory();

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
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

  const handleAddNewFoodType = async (
    e,
    newFoodTypeName,
    newFoodTypeProperty,
    newFoodTypeImg
  ) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const result = await addFoodType(
        newFoodTypeName,
        newFoodTypeProperty,
        newFoodTypeImg,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const foodType = await fetchFoodTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (foodType.error) {
        setErrorMessage(foodType.error.msg);
        throw new Error(foodType.error.msg);
      }

      setTableFoodTypeState(foodType);
      setIsSpinnerLoading(false);
      history.replace("/food/edit-food-type");
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && (
        <AddNewFoodTypeForm handleAddNewFoodType={handleAddNewFoodType} />
      )}
    </>
  );
};

export default NewFood;
