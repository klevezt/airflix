import React, { useCallback, useEffect, useState } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { menuFoodColumns } from "../../../Helpers/Const/constants";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import EditFoodForm from "../Forms/Food/EditFood";
import FadeUpLong from "../../hoc/FadeUpLong";

import {
  setFoodStatus,
  updateFood,
} from "../../../api_requests/hotel_requests";
import { getFoodEdit } from "../../../api_requests/hotel_requests";
import { deleteFood } from "../../../api_requests/hotel_requests";

import {
  fetchFoodFromDB,
  fetchFoodTypesFromDB,
} from "../../../api_requests/hotel_requests";

import { Link } from "react-router-dom";
import { DeleteForeverSharp, Edit } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useStateValue } from "../../../StateProvider";
import ErrorComponent from "../../Error/Error";

const EditFood = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const [food, setFood] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);

  const [selectedFood, setSelectedFood] = useState();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [editFood, setEditFood] = useState(false);
  const [menu, setMenu] = useState([]);

  const fetchFoodsTable = {
    columns: menuFoodColumns,
    rows: menu,
  };

  const handleFoodStatus = useCallback(async (id, status) => {
    setIsSpinnerLoading(true);
    try {
      const result = await setFoodStatus(id, status, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const food = await fetchFoodFromDB(state.token);
      // ---- Error Handler ---- //
      if (food.error) {
        setErrorMessage(food.error.msg);
        throw new Error(food.error.msg);
      }

      setFood(food);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  }, []);

  const handleEditFood = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const food = await getFoodEdit(id, state.token);
      // ---- Error Handler ---- //
      if (food.error) {
        setErrorMessage(food.error.msg);
        throw new Error(food.error.msg);
      }

      setSelectedFood(food);
      setEditFood(true);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setEditFood(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleDeleteFood = useCallback(
    async (id) => {
      setIsSpinnerLoading(true);
      try {
        const result = await deleteFood(id, state.token);
        // ---- Error Handler ---- //
        if (result.error) {
          setErrorMessage(result.error.msg);
          throw new Error(result.error.msg);
        }

        const food = await fetchFoodFromDB(state.token);
        // ---- Error Handler ---- //
        if (food.error) {
          setErrorMessage(food.error.msg);
          throw new Error(food.error.msg);
        }

        setFood(food);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    },
    [t]
  );

  const handleUpdateFood = async (
    e,
    name,
    type,
    image,
    description,
    ingredients,
    specialFeatures
  ) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const result = await updateFood(
        selectedFood._id,
        name,
        type,
        image,
        description,
        ingredients,
        specialFeatures,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      setEditFood(false);

      const food = await fetchFoodFromDB(state.token);
      // ---- Error Handler ---- //
      if (food.error) {
        setErrorMessage(food.error.msg);
        throw new Error(food.error.msg);
      }

      setFood(food);
      foodTableRows();
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const foodTableRows = useCallback(() => {
    const tempArray = [];
    food.forEach((item) => {
      tempArray.push({
        name: item.name,
        type: item.type,
        status: (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={item.status ? true : false}
              onChange={() => handleFoodStatus(item._id, !item.status)}
              autoComplete="off"
            />
          </div>
        ),
        actions: (
          <div>
            <Link to="/food/edit" onClick={() => handleEditFood(item._id)}>
              <Edit />
            </Link>
            <Link
              to="/food/edit"
              onClick={() => {
                window.confirm(`${t("confirm_delete_food")}`) &&
                  handleDeleteFood(item._id);
              }}
            >
              <DeleteForeverSharp />
            </Link>
          </div>
        ),
      });
    });
    setMenu(tempArray);
  }, [food, handleDeleteFood, handleFoodStatus]);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      setIsSpinnerLoading(true);

      try {
        const food = await fetchFoodFromDB(state.token);
        // ---- Error Handler ---- //
        if (food.error) {
          setErrorMessage(food.error.msg);
          throw new Error(food.error.msg);
        }

        setFood(food);

        const foodData = await fetchFoodTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (foodData.error) {
          setErrorMessage(foodData.error.msg);
          throw new Error(foodData.error.msg);
        }

        setFoodTypes(foodData);
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

  useEffect(() => {
    let controller = new AbortController();

    foodTableRows();

    controller = null;
    return () => controller?.abort();
  }, [isSpinnerLoading, editFood]);

  /* Status Handler */

  const handleBackButton = () => {
    setEditFood((s) => !s);
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      <FadeUpLong>
        {!error && !isSpinnerLoading && !editFood && (
          <MDBDataTableV5
            hover
            entriesOptions={[10, 20, 25]}
            entries={10}
            pagesAmount={4}
            data={fetchFoodsTable}
            searchBottom={true}
            barReverse
          />
        )}
        {!error && !isSpinnerLoading && editFood && (
          <EditFoodForm
            selectedFood={selectedFood}
            foodTypes={foodTypes}
            handleUpdateFood={handleUpdateFood}
            handleBackButton={handleBackButton}
          />
        )}
      </FadeUpLong>
    </>
  );
};

export default EditFood;
