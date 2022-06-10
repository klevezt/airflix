import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MDBDataTableV5 } from "mdbreact";
import { drinkTypesColumns } from "../../../Helpers/Const/constants";
import EditDrinkTypeForm from "../Forms/Drinks/EditDrinkType";
import FadeUpLong from "../../hoc/FadeUpLong";
import ErrorComponent from "../../Error/Error";

import {
  setDrinkTypeStatus,
  updateDrinksOfDrinkType,
  updateDrinksOfDrinkType_Status,
  updateDrinkType,
} from "../../../api_requests/hotel_requests";
import { getDrinkTypeEdit } from "../../../api_requests/hotel_requests";
import { deleteDrinkType } from "../../../api_requests/hotel_requests";

import { fetchDrinksTypesFromDB } from "../../../api_requests/hotel_requests";

import { Link, useHistory } from "react-router-dom";
import { DeleteForeverSharp, Edit } from "@mui/icons-material";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const EditDrinkType = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const history = useHistory();
  const [drinks, setDrinks] = useState([]);
  const [selectedDrinkType, setSelectedDrinkType] = useState();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [editDrinkType, setEditDrinkType] = useState(false);

  let menu = [];
  const fetchDrinksTypesTable = {
    columns: drinkTypesColumns,
    rows: menu,
  };

  const drinkTableRows = () =>{
  try {
    drinks.forEach((item) => {
      menu.push({
        name: item.name,
        type: item.type,
        status: (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={item.status ? true : false}
              onChange={() =>
                handleDrinkTypeStatus(item._id, !item.status, item.name)
              }
              autoComplete="off"
            />
          </div>
        ),
        actions: (
          <div>
            <Link
              to="/bar/edit-drink-type"
              onClick={() => handleEditDrinkType(item._id)}
            >
              <Edit />
            </Link>
            <Link
              to="/bar/edit-drink-type"
              onClick={() => {
                window.confirm(`${t("confirm_delete_drink_type")}`) &&
                  handleDeleteDrinkType(item._id, item.name);
              }}
            >
              <DeleteForeverSharp />
            </Link>
          </div>
        ),
      });
    });
  } catch (err) {
    setError(true);
    setIsSpinnerLoading(false);
  }}

  useEffect(() => {
    let controller = new AbortController();
    const exec = async () => {
      try {
        const data = await fetchDrinksTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setDrinks(data);
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
    drinkTableRows();
  }, [isSpinnerLoading]);

  /* Status Handler */

  const handleDrinkTypeStatus = async (id, status, type) => {
    setIsSpinnerLoading(true);
    try {
      await setDrinkTypeStatus(id, status, state.token);
      if (!status) await updateDrinksOfDrinkType_Status(type, state.token);
      const drinks = await fetchDrinksTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (drinks.error) {
        setErrorMessage(drinks.error.msg);
        throw new Error(drinks.error.msg);
      }

      setDrinks(drinks);
      drinkTableRows();
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleEditDrinkType = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const drinkType = await getDrinkTypeEdit(id, state.token);
      // ---- Error Handler ---- //
      if (drinkType.error) {
        setErrorMessage(drinkType.error.msg);
        throw new Error(drinkType.error.msg);
      }

      setSelectedDrinkType(drinkType);
      setEditDrinkType(true);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleDeleteDrinkType = async (id, name) => {
    setIsSpinnerLoading(true);
    try {
      await deleteDrinkType(id, state.token);
      await updateDrinksOfDrinkType(name, state.token);
      const drink = await fetchDrinksTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (drink.error) {
        setErrorMessage(drink.error.msg);
        throw new Error(drink.error.msg);
      }

      setDrinks(drink);
      setIsSpinnerLoading(false);
      history.push("/bar/edit-drink-type");
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleUpdateDrinkType = async (e, name, image) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      await updateDrinkType(
        selectedDrinkType._id,
        name,
        image,
        state.token
      ).then(() => {
        setEditDrinkType(false);
      });
      const drinks = await fetchDrinksTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (drinks.error) {
        setErrorMessage(drinks.error.msg);
        throw new Error(drinks.error.msg);
      }

      setDrinks(drinks);
      drinkTableRows();
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleBackButton = () => {
    setIsSpinnerLoading(true);
    setEditDrinkType((s) => !s);
    setIsSpinnerLoading(false);
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      <FadeUpLong>
        {!error && !isSpinnerLoading && !editDrinkType && (
          <MDBDataTableV5
            hover
            entriesOptions={[10, 20, 25]}
            entries={10}
            pagesAmount={4}
            data={fetchDrinksTypesTable}
            searchBottom={true}
            barReverse
          />
        )}

        {!error && !isSpinnerLoading && editDrinkType && (
          <EditDrinkTypeForm
            selectedDrinkType={selectedDrinkType}
            handleUpdateDrinkType={handleUpdateDrinkType}
            toggleEditDrinkType={handleBackButton}
          />
        )}
      </FadeUpLong>
    </>
  );
};

export default EditDrinkType;
