import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import {
  addFoodType,
  fetchFoodTypesFromDB,
} from "../../../api_requests/hotel_requests";
import AddNewFoodTypeForm from "../Forms/Food/AddNewFoodType";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const NewFood = () => {
  const [state] = useStateValue();
  const [tableFoodTypeState, setTableFoodTypeState] = useState([]);
  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);

  let history = useHistory();

  useEffect(() => {
    fetchFoodTypesFromDB(state.token).then((data) => {
      setTableFoodTypeState(data);
      setIsSpinnerLoading(false);
    });
  }, []);

  const handleAddNewFoodType = async (
    e,
    newFoodTypeName,
    newFoodTypeProperty,
    newFoodTypeImg
  ) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    await addFoodType(
      newFoodTypeName,
      newFoodTypeProperty,
      newFoodTypeImg,
      state.token
    );
    await fetchFoodTypesFromDB(state.token)
      .then((foodType) => {
        setTableFoodTypeState(foodType);
        setIsSpinnerLoading(false);
        history.replace("/food/edit-food-type");
      })
      .catch(() => {
        history.replace("/food/edit-food-type");
      });
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      {!isSpinnerLoading && (
        <AddNewFoodTypeForm handleAddNewFoodType={handleAddNewFoodType} />
      )}
    </>
  );
};

export default NewFood;
