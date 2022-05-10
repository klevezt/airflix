import React, { useCallback, useEffect, useState } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { menuFoodTypesColumns } from "../../../Helpers/Const/constants";
import FadeUpLong from "../../hoc/FadeUpLong";

import {
  setAlacarteTypeStatus,
  updateAlacarteType,
  updateAlacarteOfAlacarteType_Status,
} from "../../../api_requests/hotel_requests";
import { getAlacarteTypeEdit } from "../../../api_requests/hotel_requests";
import { deleteAlacarteType } from "../../../api_requests/hotel_requests";
import { fetchFoodTypesAlacarteFromDB } from "../../../api_requests/hotel_requests";

import { Link } from "react-router-dom";
import { DeleteForeverSharp, Edit } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import EditAlacarteType from "../Forms/Alacarte/EditAlacarteType";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const EditFoodTypeAlacarte = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const [foodType, setFoodType] = useState([]);

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [editAlacarteType, setEditAlacarteType] = useState(false);
  const [selectedAlacarteType, setSelectedAlacarteType] = useState();
  const [menu, setMenu] = useState([]);

  const fetchFoodTypesTable = {
    columns: menuFoodTypesColumns,
    rows: menu,
  };

  const handleDeleteAlacarteType = useCallback(
    async (id) => {
      setIsSpinnerLoading(true);
      await deleteAlacarteType(id, state.token);
      await fetchFoodTypesAlacarteFromDB(state.token).then((food) => {
        setFoodType(food);
        setIsSpinnerLoading(false);
      });
    },
    [t]
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
                handleAlacarteTypeStatus(item._id, !item.status, item.name)
              }
              autoComplete="off"
            />
          </div>
        ),
        actions: (
          <div>
            <Link
              to="/alacarte/edit-food-type"
              onClick={() => handleEditAlacarteType(item._id)}
            >
              <Edit />
            </Link>
            <Link
              to="/alacarte/edit-food-type"
              onClick={() => handleDeleteAlacarteType(item._id)}
            >
              <DeleteForeverSharp />
            </Link>
          </div>
        ),
      });
    });
    setMenu(tempArray);
  }, [foodType, handleDeleteAlacarteType, menu]);

  useEffect(() => {
    let controller = new AbortController();

    fetchFoodTypesAlacarteFromDB(state.token).then((data) => {
      setFoodType(data);
      setIsSpinnerLoading(false);
    });

    controller = null;
    return () => controller?.abort();
  }, []);

  useEffect(() => {
    foodTableRows();
  }, [isSpinnerLoading]);

  /* Status Handler */

  const handleAlacarteTypeStatus = async (id, status, type) => {
    setIsSpinnerLoading(true);
    await setAlacarteTypeStatus(id, status, state.token);
    if (!status) await updateAlacarteOfAlacarteType_Status(type, state.token);

    await fetchFoodTypesAlacarteFromDB(state.token).then((food) => {
      setFoodType(food);
      setIsSpinnerLoading(false);
    });
  };

  const handleEditAlacarteType = async (id) => {
    setIsSpinnerLoading(true);
    await getAlacarteTypeEdit(id, state.token).then((food) => {
      setSelectedAlacarteType(food);
      setEditAlacarteType(true);
      setIsSpinnerLoading(false);
    });
  };

  const toggleEditAlacarteType = async () => {
    setIsSpinnerLoading(true);
    setEditAlacarteType(false);
    await fetchFoodTypesAlacarteFromDB(state.token).then((food) => {
      setFoodType(food);
      foodTableRows();
      setIsSpinnerLoading(false);
    });
  };

  const handleUpdateAlacarteType = async (e, name, image) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    await updateAlacarteType(
      selectedAlacarteType._id,
      name,
      image,
      state.token
    ).then(() => {
      setEditAlacarteType(false);
    });
    await fetchFoodTypesAlacarteFromDB(state.token).then((food) => {
      setFoodType(food);
      foodTableRows();
      setIsSpinnerLoading(false);
    });
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      <FadeUpLong>
        {!isSpinnerLoading && !editAlacarteType && (
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

        {!isSpinnerLoading && editAlacarteType && (
          <EditAlacarteType
            selectedAlacartType={selectedAlacarteType}
            handleUpdateAlacarteType={handleUpdateAlacarteType}
            toggleEditAlacarteType={toggleEditAlacarteType}
          />
        )}
      </FadeUpLong>
    </>
  );
};

export default EditFoodTypeAlacarte;
