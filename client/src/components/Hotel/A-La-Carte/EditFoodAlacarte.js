import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MDBDataTableV5 } from "mdbreact";
import { menuFoodColumns } from "../../../Helpers/Const/constants";
import FadeUpLong from "../../hoc/FadeUpLong";
import ErrorComponent from "../../Error/Error";

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

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(true);
  const [editAlacarte, setEditAlacarte] = useState(false);
  const [menu, setMenu] = useState([]);

  const fetchFoodAlacarteTable = {
    columns: menuFoodColumns,
    rows: menu,
  };

  const handleAlacarteStatus = useCallback(async (id, status) => {
    setIsSpinnerLoading(true);
    try {
      const result = await setAlacarteStatus(id, status, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      const alacarte = await fetchAlacarteFromDB(state.token);
      // ---- Error Handler ---- //
      if (alacarte.error) {
        setErrorMessage(alacarte.error.msg);
        throw new Error(alacarte.error.msg);
      }

      setAlacarte(alacarte);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  }, []);

  const handleDeleteAlacarte = useCallback(
    async (id) => {
      setIsSpinnerLoading(true);
      try {
        const result = await deleteAlacarte(id, state.token);
        // ---- Error Handler ---- //
        if (result.error) {
          setErrorMessage(result.error.msg);
          throw new Error(result.error.msg);
        }

        const alacarte = await fetchAlacarteFromDB(state.token);
        // ---- Error Handler ---- //
        if (alacarte.error) {
          setErrorMessage(alacarte.error.msg);
          throw new Error(alacarte.error.msg);
        }

        setAlacarte(alacarte);
        setIsSpinnerLoading(false);
      } catch (err) {
        setError(true);
        setIsSpinnerLoading(false);
      }
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
      try {
        const data = await fetchAlacarteFromDB(state.token);

        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setAlacarte(data);
        const alacarte = await fetchFoodTypesAlacarteFromDB(state.token);

        // ---- Error Handler ---- //
        if (alacarte.error) {
          setErrorMessage(alacarte.error.msg);
          throw new Error(alacarte.error.msg);
        }

        setFoodAlacarteTypes(alacarte);
        setIsSpinnerLoading(false);
      } catch (err) {
        setIsSpinnerLoading(false);
        setError(true);
      }
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
    try {
      const alacarte = await getAlacarteEdit(id, state.token);
      // ---- Error Handler ---- //
      if (alacarte.error) {
        setErrorMessage(alacarte.error.msg);
        throw new Error(alacarte.error.msg);
      }

      setSelectedAlacarte(alacarte);
      setEditAlacarte(true);
      setIsSpinnerLoading(false);
    } catch (err) {
      setIsSpinnerLoading(false);
      setEditAlacarte(true);
      setError(true);
    }
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
    try {
      const result = await updateAlacarte(
        selectedAlacarte._id,
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

      setEditAlacarte(false);
      
      const alacarte = await fetchAlacarteFromDB(state.token);
      // ---- Error Handler ---- //
      if (alacarte.error) {
        setErrorMessage(alacarte.error.msg);
        throw new Error(alacarte.error.msg);
      }

      setAlacarte(alacarte);
      alacarteTableRows();
      setIsSpinnerLoading(false);
    } catch (err) {
      setIsSpinnerLoading(false);
      setError(true);
    }
  };

  const toggleEditAlacarte = async () => {
    setEditAlacarte((s) => !s);
    setIsSpinnerLoading(true);
    try {
      const alacarte = await fetchAlacarteFromDB(state.token);
      // ---- Error Handler ---- //
      if (alacarte.error) {
        setErrorMessage(alacarte.error.msg);
        throw new Error(alacarte.error.msg);
      }

      setAlacarte(alacarte);
      alacarteTableRows();
      setIsSpinnerLoading(false);
    } catch (err) {
      setIsSpinnerLoading(false);
      setError(true);
    }
  };

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      <FadeUpLong>
        {!error && !isSpinnerLoading && !editAlacarte && (
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

        {!error && !isSpinnerLoading && editAlacarte && (
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
