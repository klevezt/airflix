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
  toggleInfoContentStatus,
  updateInfo,
} from "../../../api_requests/hotel_requests";
import { DeleteOutline, Edit, Star, StarBorder, ToggleOffOutlined, ToggleOn } from "@mui/icons-material";
import EditInfo from "../Forms/Info/EditInfo";
import { removeUpperAccents } from "../../../Helpers/Functions/functions";
import { useStateValue } from "../../../StateProvider";
import { imageGetter } from "../../../Helpers/Const/constants";

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

  const basicFetch = async () => {
    try {
      const data = await fetchInfoTypesFromDB(state.token);
      // ---- Error Handler ---- //
      if (data.error) {
        setErrorMessage(data.error.msg);
        throw new Error(data.error.msg);
      }

      const { myArr } = await imageGetter(data, "Info/", true);

      // ---- Error Handler ---- //
      if (myArr === undefined || myArr === null) {
        let tmp_error =
          "Hotel/InfoComponent/useEffect => Info imageGetter Problem";
        setErrorMessage(tmp_error);
        throw new Error(tmp_error);
      }

      setInfo(myArr);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  useEffect(() => {
    let controller = new AbortController();

    setIsSpinnerLoading(true);
    const exec = async () => {
      try {
        await basicFetch();
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

  const handleDeleteInfo = async (id) => {
    setIsSpinnerLoading(true);
    try {
      const result = await deleteInfo(id, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      await basicFetch();

      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleUpdateInfo = async (e, name, image, id) => {
    e.preventDefault();
    setIsSpinnerLoading(true);

    try {
      const ali = name.replace(/\s+/g, "-").toLowerCase();
      const result = await updateInfo(id, name, ali , image, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      await basicFetch();

      setShowEdit((s) => !s);
      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setShowEdit((s) => !s);
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
      const result = await setInfoStatus(
        selectedInfo._id,
        !selectedInfo.featured,
        state.token
      );
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      await basicFetch();

      setIsSpinnerLoading(false);
    } catch (err) {
      setError(true);
      setIsSpinnerLoading(false);
    }
  };

  const handleToggleInfoStatus = async (id, newStatus) => {
    setIsSpinnerLoading(true);

    try {
      const result = await toggleInfoContentStatus(id, newStatus, state.token);
      // ---- Error Handler ---- //
      if (result.error) {
        setErrorMessage(result.error.msg);
        throw new Error(result.error.msg);
      }

      await basicFetch();
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
            color="primary"
            variant="outlined"
            className="button__rounded"
            onClick={() =>
              handleToggleInfoStatus(inf._id, !inf.status)
            }
          >
            {inf.status ? <ToggleOn /> : <ToggleOffOutlined />}
          </Button>
          <Button
            variant="outlined"
            color="warning"
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
          <img src={inf.image} alt="" />
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
            <Link to="/info/add" className="w-auto">
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
