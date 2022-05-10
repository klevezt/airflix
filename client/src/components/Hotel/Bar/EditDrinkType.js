import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MDBDataTableV5 } from "mdbreact";
import { drinkTypesColumns } from "../../../Helpers/Const/constants";
import EditDrinkTypeForm from "../Forms/Drinks/EditDrinkType";
import FadeUpLong from "../../hoc/FadeUpLong";

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

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [editDrinkType, setEditDrinkType] = useState(false);

  let menu = [];
  const fetchDrinksTypesTable = {
    columns: drinkTypesColumns,
    rows: menu,
  };

  const drinkTableRows = () =>
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

  useEffect(() => {
    let controller = new AbortController();
    let timer;
    const exec = async () => {
      fetchDrinksTypesFromDB(state.token).then((data) => {
        setDrinks(data);
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

  useEffect(() => {
    drinkTableRows();
  }, [isSpinnerLoading]);

  /* Status Handler */

  const handleDrinkTypeStatus = async (id, status, type) => {
    setIsSpinnerLoading(true);
    await setDrinkTypeStatus(id, status, state.token);
    if (!status) await updateDrinksOfDrinkType_Status(type, state.token);
    await fetchDrinksTypesFromDB(state.token).then((drinks) => {
      setDrinks(drinks);
      drinkTableRows();
      setIsSpinnerLoading(false);
    });
  };

  const handleEditDrinkType = async (id) => {
    setIsSpinnerLoading(true);
    await getDrinkTypeEdit(id, state.token).then((drinkType) => {
      setSelectedDrinkType(drinkType);
      setEditDrinkType(true);
      setIsSpinnerLoading(false);
    });
  };

  const handleDeleteDrinkType = async (id, name) => {
    setIsSpinnerLoading(true);
    await deleteDrinkType(id, state.token);
    await updateDrinksOfDrinkType(name, state.token);
    await fetchDrinksTypesFromDB(state.token).then((drink) => {
      setDrinks(drink);
      setIsSpinnerLoading(false);
    });
    history.push("/bar/edit-drink-type");
  };

  const handleUpdateDrinkType = async (e, name, image) => {
    e.preventDefault();
    setIsSpinnerLoading(true);
    await updateDrinkType(selectedDrinkType._id, name, image, state.token).then(
      () => {
        setEditDrinkType(false);
      }
    );
    await fetchDrinksTypesFromDB(state.token).then((drinks) => {
      setDrinks(drinks);
      drinkTableRows();
      setIsSpinnerLoading(false);
    });
  };

  const handleBackButton = () => {
    setIsSpinnerLoading(true);
    setTimeout(() => {
      setEditDrinkType((s) => !s);
      setIsSpinnerLoading(false);
    }, 0);
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      <FadeUpLong>
        {!isSpinnerLoading && !editDrinkType && (
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

        {!isSpinnerLoading && editDrinkType && (
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
