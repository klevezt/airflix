import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MDBDataTableV5 } from "mdbreact";
import { drinksTable } from "../../../Helpers/Const/constants";
import FadeUpLong from "../../hoc/FadeUpLong";
import EditDrinkForm from "../Forms/Drinks/EditDrink";

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

    const exec = async () => {
      await fetchDrinksFromDB(state.token).then((data) => {
        setDrinks(data);
      });
      await fetchDrinksTypesFromDB(state.token).then((data) => {
        setDrinkTypes(data);
        setIsSpinnerLoading(false);
      });
    };
    exec();
    controller = null;
    return () => {
      controller?.abort();
    };
  }, []);

  /* Status Handler */

  const handleDrinkStatus = useCallback(async (id, status) => {
    setIsSpinnerLoading(true);
    await setDrinkStatus(id, status, state.token);
    await fetchDrinksFromDB(state.token).then((drinks) => {
      setDrinks(drinks);
      setIsSpinnerLoading(false);
    });
  }, []);

  const handleEditDrink = async (id) => {
    setIsSpinnerLoading(true);
    await getDrinkEdit(id, state.token).then((drink) => {
      setSelectedDrink(drink);
      setEditDrink(true);
      setIsSpinnerLoading(false);
    });
  };

  const handleDeleteDrink = useCallback(
    async (id) => {
      setIsSpinnerLoading(true);
      await deleteDrink(id, state.token);
      await fetchDrinksFromDB(state.token).then((drink) => {
        setDrinks(drink);
        setIsSpinnerLoading(false);
      });
    },
    [t]
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
    await updateDrink(
      selectedDrink._id,
      name,
      type,
      image,
      description,
      price,
      ingredients,
      state.token
    ).then(() => {
      setEditDrink(false);
    });
    await fetchDrinksFromDB(state.token).then((drinks) => {
      setDrinks(drinks);
      setIsSpinnerLoading(false);
    });
  };

  const toggleEditDrink = () => {
    setIsSpinnerLoading(true);
    setTimeout(() => {
      setEditDrink((s) => !s);
      setIsSpinnerLoading(false);
    }, 0);
  };

  const drinkTableRows = useCallback(() => {
    const tempArray = [];
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
  }, [drinks, handleDrinkStatus, handleDeleteDrink]);

  useEffect(() => {
    drinkTableRows();
  }, [isSpinnerLoading, editDrink]);

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      <FadeUpLong>
        {!isSpinnerLoading && !editDrink && (
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

        {!isSpinnerLoading && editDrink && (
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
