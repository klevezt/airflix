import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MDBDataTableV5 } from "mdbreact";
import { drinksTable } from "../../../Helpers/Const/constants";
import FadeUpLong from "../../hoc/FadeUpLong";
import EditDrinkForm from "../Forms/Drinks/EditDrink";
import ErrorComponent from "../../Error/Error";

import {
  setDrinkStatus,
  updateDrink,
} from "../../../api_requests/hotel_requests";
import { getDrinkEdit } from "../../../api_requests/hotel_requests";
import { deleteDrink } from "../../../api_requests/hotel_requests";

import {
  fetchDrinksFromDB,
  fetchDrinksTypesFromDB,
} from "../../../api_requests/hotel_requests";

import { DeleteForeverSharp, Edit } from "@mui/icons-material";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const EditDrink = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const [drinks, setDrinks] = useState([]);
  const [drinkTypes, setDrinkTypes] = useState([]);
  const [selectedDrink, setSelectedDrink] = useState();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [editDrink, setEditDrink] = useState(false);
  const [menu, setMenu] = useState([]);

  // let menu = [];
  const fetchDrinksTable = {
    columns: drinksTable,
    rows: menu,
  };

  useEffect(() => {
    let controller = new AbortController();
    setIsSpinnerLoading(true);

    const exec = async () => {
      try {
        const drinks = await fetchDrinksFromDB(state.token);
        // ---- Error Handler ---- //
        if (drinks.error) {
          setErrorMessage(drinks.error.msg);
          throw new Error(drinks.error.msg);
        }

        setDrinks(drinks);

        const data = await fetchDrinksTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setDrinkTypes(data);
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

  const handleDrinkStatus = useCallback(
    async (id, status) => {
      setIsSpinnerLoading(true);
      try {
        const result = await setDrinkStatus(id, status, state.token);
        // ---- Error Handler ---- //
        if (result.error) {
          setErrorMessage(result.error.msg);
          throw new Error(result.error.msg);
        }

        const drinks = await fetchDrinksFromDB(state.token);
        // ---- Error Handler ---- //
        if (drinks.error) {
          setErrorMessage(drinks.error.msg);
          throw new Error(drinks.error.msg);
        }
        setDrinks(drinks);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    },
    [state.token]
  );

  const handleEditDrink = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const drink = await getDrinkEdit(id, state.token);
      // ---- Error Handler ---- //
      if (drink.error) {
        setErrorMessage(drink.error.msg);
        throw new Error(drink.error.msg);
      }

      setSelectedDrink(drink);
      setEditDrink(true);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setEditDrink(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleDeleteDrink = useCallback(
    async (id) => {
      setIsSpinnerLoading(true);
      try {
        const result = await deleteDrink(id, state.token);
        // ---- Error Handler ---- //
        if (result.error) {
          setErrorMessage(result.error.msg);
          throw new Error(result.error.msg);
        }

        const drink = await fetchDrinksFromDB(state.token);
        // ---- Error Handler ---- //
        if (drink.error) {
          setErrorMessage(drink.error.msg);
          throw new Error(drink.error.msg);
        }

        setDrinks(drink);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
    },
    [state.token]
  );

  const handleUpdateDrink = async (
    e,
    name,
    type,
    image,
    description,
    price,
    ingredients
  ) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    try {
      const result = await updateDrink(
        selectedDrink._id,
        name,
        type,
        image,
        description,
        price,
        ingredients,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      setEditDrink(false);
      const drinks = await fetchDrinksFromDB(state.token);
      // ---- Error Handler ---- //
      if (drinks.error) {
        setErrorMessage(drinks.error.msg);
        throw new Error(drinks.error.msg);
      }

      setDrinks(drinks);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const toggleEditDrink = () => {
    setIsSpinnerLoading(true);
    setEditDrink((s) => !s);
    setIsSpinnerLoading(false);
  };

  const drinkTableRows = useCallback(() => {
    const tempArray = [];
    try {
      drinks.forEach((item) => {
        tempArray.push({
          name: item.name,
          type: item.type,
          status: (
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={item.status ? true : false}
                onChange={() => handleDrinkStatus(item._id, !item.status)}
                autoComplete="off"
              />
            </div>
          ),
          actions: (
            <div>
              <Link to="/bar/edit" onClick={() => handleEditDrink(item._id)}>
                <Edit />
              </Link>
              <Link
                to="/bar/edit"
                onClick={() => {
                  window.confirm(`${t("confirm_delete_drink")}`) &&
                    handleDeleteDrink(item._id);
                }}
              >
                <DeleteForeverSharp />
              </Link>
            </div>
          ),
        });
      });
      setMenu(tempArray);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  }, [drinks, handleDrinkStatus, handleDeleteDrink]);

  useEffect(() => {
    let controller = new AbortController();

    drinkTableRows();

    controller = null;
    return () => controller?.abort();
  }, [isSpinnerLoading, editDrink]);

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      <FadeUpLong>
        {!error && !isSpinnerLoading && !editDrink && (
          <MDBDataTableV5
            hover
            entriesOptions={[10, 20, 25]}
            entries={10}
            pagesAmount={4}
            data={fetchDrinksTable}
            searchBottom={true}
            barReverse
          />
        )}

        {!error && !isSpinnerLoading && editDrink && (
          <EditDrinkForm
            selectedDrink={selectedDrink}
            drinkTypes={drinkTypes}
            handleUpdateDrink={handleUpdateDrink}
            toggleEditDrink={toggleEditDrink}
          />
        )}
      </FadeUpLong>
    </>
  );
};

export default EditDrink;
