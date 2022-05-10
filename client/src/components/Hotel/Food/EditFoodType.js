import React, { useCallback, useEffect, useState } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { menuFoodTypesColumns } from "../../../Helpers/Const/constants";
import FadeUpLong from "../../hoc/FadeUpLong";
import EditFoodFormType from "../Forms/Food/EditFoodType";

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

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [menu, setMenu] = useState([]);

  const fetchFoodTypesTable = {
    columns: menuFoodTypesColumns,
    rows: menu,
  };

  useEffect(() => {
    let controller = new AbortController();
    let timer;
    const exec = async () => {
      fetchFoodTypesFromDB(state.token).then((data) => {
        setFoodType(data);
        timer = setTimeout(() => {
          setIsSpinnerLoading(false);
        }, 500);
      });
    };
    exec();
    controller = null;
    return () => {
      clearTimeout(timer);
      controller?.abort();
    };
  }, []);

  /* Status Handler */

  const handleFoodTypeStatus = useCallback(async (id, status, type) => {
    setIsSpinnerLoading(true);
    await setFoodTypeStatus(id, status, state.token);
    if (!status) await updateFoodOfFoodType_Status(type, state.token);
    await fetchFoodTypesFromDB(state.token).then((food) => {
      setFoodType(food);
      setIsSpinnerLoading(false);
    });
  }, []);

  const handleEditFoodType = useCallback(async (id) => {
    setIsSpinnerLoading(true);
    await getFoodTypeEdit(id, state.token).then((data) => {
      setSelectedFoodType(data);
      setEditFoodType(true);
      setIsSpinnerLoading(false);
    });
  }, []);

  const handleDeleteFoodType = useCallback(async (id) => {
    setIsSpinnerLoading(true);
    await deleteFoodType(id, state.token);
    await fetchFoodTypesFromDB(state.token).then((food) => {
      setFoodType(food);
      setIsSpinnerLoading(false);
    });
  }, []);

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

  const handleUpdateFoodType = async (e, name,image) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    await updateFoodType(selectedFoodType._id, name,image, state.token).then(() => {
      setEditFoodType(false);
    });
    await fetchFoodTypesFromDB(state.token).then((food) => {
      setFoodType(food);
      foodTableRows();
      setIsSpinnerLoading(false);
    });
  };

  useEffect(() => {
    foodTableRows();
  }, [isSpinnerLoading, foodTableRows]);

  const handleBackButton = () => {
    setEditFoodType((s) => !s);
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      <FadeUpLong>
        {!isSpinnerLoading && !editFoodType && (
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
        {!isSpinnerLoading && editFoodType && (
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
