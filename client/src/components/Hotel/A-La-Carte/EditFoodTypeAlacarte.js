import React, { useCallback, useEffect, useState } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { menuFoodTypesColumns } from "../../../Helpers/Const/constants";
import FadeUpLong from "../../hoc/FadeUpLong";
import ErrorComponent from "../../Error/Error";

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
import EditAlacarteType from "../Forms/Alacarte/EditAlacarteType";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const EditFoodTypeAlacarte = () => {
  const [state] = useStateValue();
  const [foodType, setFoodType] = useState([]);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      try {
        const result = await deleteAlacarteType(id, state.token);
        // ---- Error Handler ---- //
        if (result.error) {
          setErrorMessage(result.error.msg);
          throw new Error(result.error.msg);
        }

        const food = await fetchFoodTypesAlacarteFromDB(state.token);
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

    const exec = async () => {
      try {
        const data = await fetchFoodTypesAlacarteFromDB(state.token);
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

  useEffect(() => {
    let controller = new AbortController();

    foodTableRows();

    controller = null;
    return () => controller?.abort();
  }, [isSpinnerLoading]);

  /* Status Handler */

  const handleAlacarteTypeStatus = async (id, status, type) => {
    setIsSpinnerLoading(true);
    try {
      const result = await setAlacarteTypeStatus(id, status, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      if (!status) {
        const result2 = await updateAlacarteOfAlacarteType_Status(
          type,
          state.token
        );
        // ---- Error Handler ---- //
        if (result2.error) {
          setErrorMessage(result2.error.msg);
          throw new Error(result2.error.msg);
        }
      }

      const food = await fetchFoodTypesAlacarteFromDB(state.token);
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
  };

  const handleEditAlacarteType = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const food = await getAlacarteTypeEdit(id, state.token);
      // ---- Error Handler ---- //
      if (food.error) {
        setErrorMessage(food.error.msg);
        throw new Error(food.error.msg);
      }

      setSelectedAlacarteType(food);
      setEditAlacarteType(true);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setEditAlacarteType(true);
      setIsSpinnerLoading(false);
    }
  };

  const toggleEditAlacarteType = async () => {
    setIsSpinnerLoading(true);
    setEditAlacarteType(false);
    try {
      const food = await fetchFoodTypesAlacarteFromDB(state.token);
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

  const handleUpdateAlacarteType = async (e, name, image) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const result = await updateAlacarteType(
        selectedAlacarteType._id,
        name,
        image,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      setEditAlacarteType(false);

      const food = await fetchFoodTypesAlacarteFromDB(state.token);
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

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      <FadeUpLong>
        {!error && !isSpinnerLoading && !editAlacarteType && (
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

        {!error && !isSpinnerLoading && editAlacarteType && (
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
