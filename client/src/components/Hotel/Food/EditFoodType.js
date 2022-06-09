import React, { useCallback, useEffect, useState } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { menuFoodTypesColumns } from "../../../Helpers/Const/constants";
import FadeUpLong from "../../hoc/FadeUpLong";
import EditFoodFormType from "../Forms/Food/EditFoodType";
import ErrorComponent from "../../Error/Error";

import {
  setFoodTypeStatus,
  updateFoodType,
  updateFoodOfFoodType_Status,
} from "../../../api_requests/hotel_requests";
import { getFoodTypeEdit } from "../../../api_requests/hotel_requests";
import { deleteFoodType } from "../../../api_requests/hotel_requests";

import { fetchFoodTypesFromDB } from "../../../api_requests/hotel_requests";
import { Link } from "react-router-dom";
import { DeleteForeverSharp, Edit } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const EditFoodType = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const [foodType, setFoodType] = useState([]);
  const [editFoodType, setEditFoodType] = useState(false);
  const [selectedFoodType, setSelectedFoodType] = useState();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [menu, setMenu] = useState([]);

  const fetchFoodTypesTable = {
    columns: menuFoodTypesColumns,
    rows: menu,
  };

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      try {
        const data = await fetchFoodTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setFoodType(data);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, [state.token]);

  /* Status Handler */

  const handleFoodTypeStatus = useCallback(
    async (id, status, type) => {
      setIsSpinnerLoading(true);
      try {
        await setFoodTypeStatus(id, status, state.token);
        if (!status) await updateFoodOfFoodType_Status(type, state.token);
        const food = await fetchFoodTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (food.error) {
          setErrorMessage(food.error.msg);
          throw new Error(food.error.msg);
        }

        setFoodType(food);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    },
    [state.token]
  );

  const handleEditFoodType = useCallback(
    async (id) => {
      setIsSpinnerLoading(true);
      try {
        const data = await getFoodTypeEdit(id, state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setSelectedFoodType(data);
        setEditFoodType(true);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    },
    [state.token]
  );

  const handleDeleteFoodType = useCallback(
    async (id) => {
      setIsSpinnerLoading(true);
      try {
        await deleteFoodType(id, state.token);
        const food = await fetchFoodTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (food.error) {
          setErrorMessage(food.error.msg);
          throw new Error(food.error.msg);
        }

        setFoodType(food);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    },
    [state.token]
  );

  const foodTableRows = useCallback(() => {
    const tempArray = [];
    foodType.forEach((item) => {
      tempArray.push({
        name: item.name,
        status: (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={item.status ? true : false}
              onChange={() =>
                handleFoodTypeStatus(item._id, !item.status, item.name)
              }
              autoComplete="off"
            />
          </div>
        ),
        actions: (
          <div>
            <Link
              to="/food/edit-food-type"
              onClick={() => handleEditFoodType(item._id)}
            >
              <Edit />
            </Link>
            <Link
              to="/food/edit-food-type"
              onClick={() => {
                window.confirm(`${t("confirm_delete_food_type")}`) &&
                  handleDeleteFoodType(item._id);
              }}
            >
              <DeleteForeverSharp />
            </Link>
          </div>
        ),
      });
    });
    setMenu(tempArray);
  }, [
    t,
    foodType,
    handleDeleteFoodType,
    handleFoodTypeStatus,
    handleEditFoodType,
  ]);

  const handleUpdateFoodType = async (e, name, image) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      await updateFoodType(selectedFoodType._id, name, image, state.token).then(
        () => {
          setEditFoodType(false);
        }
      );
      const food = await fetchFoodTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (food.error) {
        setErrorMessage(food.error.msg);
        throw new Error(food.error.msg);
      }

      setFoodType(food);
      foodTableRows();
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  useEffect(() => {
    foodTableRows();
  }, [isSpinnerLoading, foodTableRows]);

  const handleBackButton = () => {
    setEditFoodType((s) => !s);
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      <FadeUpLong>
        {!error && !isSpinnerLoading && !editFoodType && (
          <MDBDataTableV5
            hover
            entriesOptions={[10, 20, 25]}
            entries={10}
            pagesAmount={4}
            data={fetchFoodTypesTable}
            searchBottom={true}
            barReverse
          />
        )}
        {!error && !isSpinnerLoading && editFoodType && (
          <EditFoodFormType
            selectedFoodType={selectedFoodType}
            handleUpdateFoodType={handleUpdateFoodType}
            handleBackButton={handleBackButton}
          />
        )}
      </FadeUpLong>
    </>
  );
};

export default EditFoodType;
