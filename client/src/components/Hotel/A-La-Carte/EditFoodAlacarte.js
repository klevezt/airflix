import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MDBDataTableV5 } from "mdbreact";
import { menuFoodColumns } from "../../../Helpers/Const/constants";
import FadeUpLong from "../../hoc/FadeUpLong";

import {
  setAlacarteStatus,
  updateAlacarte,
} from "../../../api_requests/hotel_requests";
import { getAlacarteEdit } from "../../../api_requests/hotel_requests";
import { deleteAlacarte } from "../../../api_requests/hotel_requests";

import {
  fetchFoodTypesAlacarteFromDB,
  fetchAlacarteFromDB,
} from "../../../api_requests/hotel_requests";

import { DeleteForeverSharp, Edit } from "@mui/icons-material";
import EditAlacarte from "../Forms/Alacarte/EditAlacarte";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useStateValue } from "../../../StateProvider";

const EditFoodAlacarte = () => {
  const [state] = useStateValue();
  const { t } = useTranslation();
  const [alacarte, setAlacarte] = useState([]);
  const [alacarteTypes, setFoodAlacarteTypes] = useState([]);
  const [selectedAlacarte, setSelectedAlacarte] = useState();

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [editAlacarte, setEditAlacarte] = useState(false);
  const [menu, setMenu] = useState([]);

  const fetchFoodAlacarteTable = {
    columns: menuFoodColumns,
    rows: menu,
  };

  const handleAlacarteStatus = useCallback(async (id, status) => {
    setIsSpinnerLoading(true);
    await setAlacarteStatus(id, status, state.token);
    await fetchAlacarteFromDB(state.token).then((alacarte) => {
      setAlacarte(alacarte);
      setIsSpinnerLoading(false);
    });
  }, []);

  const handleDeleteAlacarte = useCallback(
    async (id) => {
      setIsSpinnerLoading(true);
      await deleteAlacarte(id, state.token);
      await fetchAlacarteFromDB(state.token).then((alacarte) => {
        setAlacarte(alacarte);
        setIsSpinnerLoading(false);
      });
    },
    [t]
  );
  const alacarteTableRows = useCallback(() => {
    const tempArray = [];

    alacarte.forEach((item) => {
      tempArray.push({
        name: item.name,
        type: item.type,
        status: (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={item.status ? true : false}
              onChange={() => handleAlacarteStatus(item._id, !item.status)}
              autoComplete="off"
            />
          </div>
        ),
        actions: (
          <div>
            <Link
              to="/alacarte/edit"
              onClick={() => handleEditAlacarte(item._id)}
            >
              <Edit />
            </Link>
            <Link
              to="/alacarte/edit"
              onClick={() => handleDeleteAlacarte(item._id)}
            >
              <DeleteForeverSharp />
            </Link>
          </div>
        ),
      });
    });
    setMenu(tempArray);
  }, [alacarte, menu, handleAlacarteStatus, handleDeleteAlacarte]);

  useEffect(() => {
    let controller = new AbortController();

    const exec = async () => {
      await fetchAlacarteFromDB(state.token).then((data) => {
        setAlacarte(data);
      });
      await fetchFoodTypesAlacarteFromDB(state.token).then((data) => {
        setFoodAlacarteTypes(data);
        setIsSpinnerLoading(false);
      });
    };
    exec();
    controller = null;
    return () => controller?.abort();
  }, []);

  useEffect(() => {
    alacarteTableRows();
  }, [isSpinnerLoading]);

  /* Status Handler */

  const handleEditAlacarte = async (id) => {
    setIsSpinnerLoading(true);
    await getAlacarteEdit(id, state.token).then((alacarte) => {
      setSelectedAlacarte(alacarte);
      setEditAlacarte(true);
      setIsSpinnerLoading(false);
    });
  };

  const handleUpdateAlacarte = async (
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
    await updateAlacarte(
      selectedAlacarte._id,
      name,
      type,
      image,
      description,
      price,
      ingredients,
      state.token
    ).then(() => {
      setEditAlacarte(false);
    });
    await fetchAlacarteFromDB(state.token).then((alacarte) => {
      setAlacarte(alacarte);
      alacarteTableRows();
      setIsSpinnerLoading(false);
    });
  };

  const toggleEditAlacarte = async () => {
    setEditAlacarte((s) => !s);
    setIsSpinnerLoading(true);
    await fetchAlacarteFromDB(state.token).then((alacarte) => {
      setAlacarte(alacarte);
      alacarteTableRows();
      setIsSpinnerLoading(false);
    });
  };

  return (
    <>
      {isSpinnerLoading && <LoadingSpinner />}
      <FadeUpLong>
        {!isSpinnerLoading && !editAlacarte && (
          <MDBDataTableV5
            hover
            entriesOptions={[10, 20, 25]}
            entries={10}
            pagesAmount={4}
            data={fetchFoodAlacarteTable}
            searchBottom={true}
            barReverse
          />
        )}

        {!isSpinnerLoading && editAlacarte && (
          <EditAlacarte
            selected={selectedAlacarte}
            alacarteTypes={alacarteTypes}
            handleUpdateAlacarte={handleUpdateAlacarte}
            toggleEditAlacarte={toggleEditAlacarte}
          />
        )}
      </FadeUpLong>
    </>
  );
};

export default EditFoodAlacarte;
