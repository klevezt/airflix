import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import LoadingSpinner from "../../UI/Spinners/LoadingSpinner";
import { useTranslation } from "react-i18next";

import ErrorComponent from "../../Error/Error";

import "./InfoComponent.css";
import {
  deleteInfo,
  fetchInfoTypesFromDB,
  setInfoStatus,
  updateInfo,
} from "../../../api_requests/hotel_requests";
import { DeleteOutline, Edit, Star, StarBorder } from "@mui/icons-material";
import EditInfo from "../Forms/Info/EditInfo";
import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import { useStateValue } from "../../../StateProvider";

const InfoComponent = () => {
  const [state] = useStateValue();

  const { t } = useTranslation();
  const translate = (text) => removeUpperAccents(t(text));

  const [info, setInfo] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState();
  const [showEdit, setShowEdit] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [isSpinnerLoading, setIsSpinnerLoading] = useState(false);

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      try {
        const data = await fetchInfoTypesFromDB(state.token);
        // ---- Error Handler ---- //
        if (data.error) {
          setErrorMessage(data.error.msg);
          throw new Error(data.error.msg);
        }

        setInfo(data);
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

  const handleDeleteInfo = async (id) => {
    setIsSpinnerLoading(true);
    try {
      await deleteInfo(id, state.token);
      const data = await fetchInfoTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      setInfo(data);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleUpdateInfo = async (e) => {
    setIsSpinnerLoading(true);
    try {
      // await updateInfo(name, type, content).then(() => {});
      const data = await fetchInfoTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      setInfo(data);
      setShowEdit((s) => !s);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleEditInfo = (selectedInfo) => {
    setShowEdit((s) => !s);
    setSelectedInfo(selectedInfo);
  };

  const handleChangeFeatured = async (selectedInfo) => {
    setIsSpinnerLoading(true);
    try {
      await setInfoStatus(
        selectedInfo._id,
        !selectedInfo.featured,
        state.token
      );
      const data = await fetchInfoTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      setInfo(data);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };
  const allInfo = info.map((inf, i) => {
    return (
      <div className="info-flex-three" key={i}>
        <div className="w-100 buttons-wrapper">
          <Button
            variant="outlined"
            color="warning"
            className="button__rounded"
            onClick={() => handleChangeFeatured(inf)}
          >
            {inf.featured ? <Star /> : <StarBorder />}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className="button__rounded"
            onClick={() => handleEditInfo(inf)}
          >
            <Edit />
          </Button>
          <Button
            variant="outlined"
            color="error"
            className="button__rounded"
            onClick={() => handleDeleteInfo(inf._id)}
          >
            <DeleteOutline />
          </Button>
        </div>
        <Link
          to={`/info/view/${inf.alias}`}
          className="info-avatar text-center"
        >
          <img
            src={`${process.env.REACT_APP_IMAGES_URL}/Images/Info/${inf.image}`}
            alt=""
          />
          <div className=" text-center info-description">
            <h2>{translate(inf.name)}</h2>
          </div>
        </Link>
      </div>
    );
  });

  return (
    <>
      {!error && isSpinnerLoading && <LoadingSpinner />}
      {error && <ErrorComponent errorMessage={errorMessage} />}
      {!error && !isSpinnerLoading && !showEdit && (
        <section className="info-wrapper">
          <div className="row mb-5">
            <Link to="/info/add" className="text-center">
              <Button
                variant="contained"
                color="primary"
                className="button__addUser mb-3"
              >
                <AddIcon />
                {translate("add_information")}
              </Button>
            </Link>
          </div>

          <div className={`col-12 info-box`}>{allInfo}</div>
        </section>
      )}
      {!error && !isSpinnerLoading && showEdit && (
        <EditInfo
          handleUpdateInfo={handleUpdateInfo}
          handleBackButton={() => setShowEdit((s) => !s)}
          info={selectedInfo}
        />
      )}
    </>
  );
};

export default InfoComponent;
