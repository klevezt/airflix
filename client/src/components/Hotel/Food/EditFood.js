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

const EditFood = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const [food, setFood] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);

  const [selectedFood, setSelectedFood] = useState();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [editFood, setEditFood] = useState(false);
  const [menu, setMenu] = useState([]);

  const fetchFoodsTable = {
    columns: menuFoodColumns,
    rows: menu,
  };

  const handleFoodStatus = useCallback(async (id, status) => {
    setIsSpinnerLoading(true);
    await setFoodStatus(id, status, state.token);
    await fetchFoodFromDB(state.token).then((food) => {
      setFood(food);
      setIsSpinnerLoading(false);
    });
  }, []);

  const handleEditFood = async (id) => {
    setIsSpinnerLoading(true);
    await getFoodEdit(id, state.token).then((food) => {
      setSelectedFood(food);
      setEditFood(true);
      setIsSpinnerLoading(false);
    });
  };

  const handleDeleteFood = useCallback(
    async (id) => {
      setIsSpinnerLoading(true);
      await deleteFood(id, state.token);
      await fetchFoodFromDB(state.token).then((food) => {
        setFood(food);
        setIsSpinnerLoading(false);
      });
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
    await updateFood(
      selectedFood._id,
      name,
      type,
      image,
      description,
      ingredients,
      specialFeatures,
      state.token
    ).then(() => {
      setEditFood(false);
    });
    await fetchFoodFromDB(state.token).then((food) => {
      setFood(food);
      foodTableRows();
      setIsSpinnerLoading(false);
    });
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
    let timer;

    const exec = async () => {
      await fetchFoodFromDB(state.token).then((data) => {
        setFood(data);
      });
      await fetchFoodTypesFromDB(state.token).then((data) => {
        setFoodTypes(data);
        setIsSpinnerLoading(false);
      });
    };
    exec();
    controller = null;
    return () => {
      controller?.abort();
    };
  }, []);

  useEffect(() => {
    foodTableRows();
  }, [isSpinnerLoading, editFood]);

  /* Status Handler */

  const handleBackButton = () => {
    setEditFood((s) => !s);
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      <FadeUpLong>
        {!isSpinnerLoading && !editFood && (
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
        {!isSpinnerLoading && editFood && (
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
